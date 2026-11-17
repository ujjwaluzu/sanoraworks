"use client";

import Script from "next/script";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { TURNSTILE_ACTION, verificationFailed, verificationUnavailable } from "@/lib/turnstile";

type WidgetOptions = {
  sitekey: string;
  action: string;
  size: "flexible" | "compact";
  execution: "execute";
  retry: "never";
  "refresh-expired": "never";
  "refresh-timeout": "never";
  "response-field": false;
  callback(token: string): void;
  "error-callback"(): void;
  "expired-callback"(): void;
  "timeout-callback"(): void;
  "unsupported-callback"(): void;
};
declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: WidgetOptions): string;
      execute(id: string): void;
      reset(id: string): void;
      remove(id: string): void;
    };
  }
}
export type VerificationHandle = { verify(): Promise<string>; reset(): void };

export function TurnstileVerification({ siteKey, ref }: { siteKey: string; ref: Ref<VerificationHandle> }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const compact = useRef(false);
  const pending = useRef<{ resolve(token: string): void; reject(error: Error): void } | null>(null);
  const [issue, setIssue] = useState(siteKey ? "" : verificationUnavailable);
  const [ready, setReady] = useState(false);

  const fail = useCallback((message: string) => {
    setIssue(message);
    const attempt = pending.current;
    pending.current = null;
    attempt?.reject(new Error(message));
  }, []);

  const renderWidget = useCallback(() => {
    if (!siteKey || !container.current || !window.turnstile || widget.current !== null) return;
    try {
      compact.current = container.current.clientWidth < 300;
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey, action: TURNSTILE_ACTION, size: compact.current ? "compact" : "flexible", execution: "execute",
        retry: "never", "refresh-expired": "never", "refresh-timeout": "never", "response-field": false,
        callback(token) {
          const attempt = pending.current;
          pending.current = null;
          attempt?.resolve(token);
        },
        "error-callback": () => fail(verificationUnavailable),
        "unsupported-callback": () => fail(verificationUnavailable),
        "expired-callback": () => fail(verificationFailed),
        "timeout-callback": () => fail(verificationFailed),
      });
      setReady(true);
      setIssue("");
    } catch { fail(verificationUnavailable); }
  }, [siteKey, fail]);

  useEffect(() => {
    const frame = requestAnimationFrame(renderWidget);
    const observer = new ResizeObserver(() => {
      if (!container.current || widget.current === null || (container.current.clientWidth < 300) === compact.current) return;
      if (pending.current) fail(verificationFailed);
      window.turnstile?.remove(widget.current);
      widget.current = null;
      renderWidget();
    });
    if (container.current) observer.observe(container.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const attempt = pending.current;
      pending.current = null;
      attempt?.reject(new DOMException("Contact page closed", "AbortError"));
      if (widget.current !== null) {
        window.turnstile?.remove(widget.current);
        widget.current = null;
      }
    };
  }, [renderWidget, fail]);

  useEffect(() => {
    if (!siteKey || ready) return;
    const timer = setTimeout(() => fail(verificationUnavailable), 12_000);
    return () => clearTimeout(timer);
  }, [siteKey, ready, fail]);

  useImperativeHandle(ref, () => ({
    async verify() {
      renderWidget();
      if (!window.turnstile || widget.current === null) throw new Error(verificationUnavailable);
      setIssue("");
      const token = new Promise<string>((resolve, reject) => { pending.current = { resolve, reject }; });
      const timer = setTimeout(() => fail(verificationFailed), 120_000);
      try {
        window.turnstile.reset(widget.current);
        window.turnstile.execute(widget.current);
      } catch { fail(verificationUnavailable); }
      try { return await token; }
      finally { clearTimeout(timer); }
    },
    reset() {
      if (widget.current !== null) {
        try { window.turnstile?.reset(widget.current); }
        catch { fail(verificationUnavailable); }
      }
    },
  }));

  return (
    <div className="form-verification">
      {siteKey && <Script
        id="contact-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => fail(verificationUnavailable)}
      />}
      <p className="field-hint" id="verification-hint">Security verification runs when you select Send enquiry.</p>
      <div ref={container} aria-describedby="verification-hint" />
      {issue && <p className="form-availability" role="alert">{issue} <a href="mailto:enquiries@sanoraworks.com">Email us</a>.</p>}
    </div>
  );
}
