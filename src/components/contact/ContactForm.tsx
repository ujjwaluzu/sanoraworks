"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Download, LoaderCircle, AlertCircle } from "lucide-react";
import { budgetOptions, formatProjectBrief, projectTypes, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/enquiry";

export function ContactForm({ deliveryEnabled, initialProjectType }: { deliveryEnabled: boolean; initialProjectType: string }) {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "downloaded" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  function readForm() {
    const result = validateEnquiry(Object.fromEntries(new FormData(formRef.current!)));
    if (!result.success) {
      setErrors(result.errors); setStatus("idle"); setMessage("");
      requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    setErrors({});
    return result.data;
  }

  function downloadBrief(data: Enquiry) {
    const blob = new Blob([formatProjectBrief(data)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "sanora-works-project-brief.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("downloaded"); setMessage("Your project brief is ready and the download has started. It has not been sent to Sanora Works.");
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = readForm(); if (!data) return;
    if (!deliveryEnabled) { downloadBrief(data); return; }
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(15_000) });
      const result = await response.json() as { message?: string; error?: string; errors?: EnquiryErrors };
      if (!response.ok) { setErrors(result.errors ?? {}); throw new Error(result.error || "We couldn’t confirm delivery. Please try again."); }
      setStatus("sent"); setMessage(result.message || "Your enquiry has been accepted. Thank you for sharing your idea.");
      formRef.current?.reset();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error && error.name !== "TimeoutError" ? error.message : "We couldn’t confirm delivery. Your brief is still here; try again or download a copy."); }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const errorProps = (name: keyof Enquiry) => ({ "aria-invalid": errors[name] ? true as const : undefined, "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const errorText = (name: keyof Enquiry) => errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>;

  return <form ref={formRef} className="enquiry-form" onSubmit={submit} noValidate><div className="form-heading"><h2>Tell us what you have in mind.</h2><span className="mono">* REQUIRED</span></div>{!deliveryEnabled && <div className="form-availability"><span className="status-dot" /><p>Online enquiries are not open yet. Prepare and download your project brief below so it’s ready for a conversation.</p></div>}{Object.keys(errors).length > 0 && <div className="form-error-summary" ref={errorRef} tabIndex={-1} role="alert"><strong>A few details need your attention.</strong><ul>{Object.entries(errors).map(([key, error]) => <li key={key}><a href={`#${key}`}>{error}</a></li>)}</ul></div>}<fieldset disabled={status === "sending"} className="form-fields"><legend className="sr-only">Project enquiry details</legend><div className="form-row"><div className="field"><label htmlFor="name">Your name <span>*</span></label><input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required minLength={2} maxLength={100} {...errorProps("name")} />{errorText("name")}</div><div className="field"><label htmlFor="email">Email address <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254} {...errorProps("email")} />{errorText("email")}</div></div><div className="field"><label htmlFor="company">Company <span className="field-optional">Optional</span></label><input id="company" name="company" autoComplete="organization" placeholder="Where you’re building" maxLength={160} {...errorProps("company")} />{errorText("company")}</div><div className="form-row"><div className="field"><label htmlFor="projectType">Project type <span>*</span></label><select id="projectType" name="projectType" defaultValue={initialProjectType} required {...errorProps("projectType")}><option value="" disabled>Select a project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select>{errorText("projectType")}</div><div className="field"><label htmlFor="budget">Estimated budget <span className="field-optional">Optional</span></label><select id="budget" name="budget" defaultValue="" {...errorProps("budget")}><option value="">Select a range</option>{budgetOptions.map(budget => <option key={budget}>{budget}</option>)}</select>{errorText("budget")}</div></div><div className="field"><label htmlFor="description">A little about your project <span>*</span></label><textarea id="description" name="description" rows={6} required minLength={30} maxLength={5000} placeholder="What would you like to build? Tell us about the challenge, the people it’s for, and what you hope to achieve." {...errorProps("description")} /><span className="field-hint">30–5,000 characters. Please leave out passwords or confidential information.</span>{errorText("description")}</div><div className="form-trap" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div></fieldset><div className="form-submit-row"><p>{deliveryEnabled ? <>Your details will be used to respond to your enquiry. </> : <>Your brief is created on your device and isn’t sent to us. </>}<Link href="/privacy">Privacy Policy</Link></p><button type="submit" disabled={status === "sending"} className="button button-primary">{status === "sending" ? <>Sending enquiry<LoaderCircle size={16} className="spin" aria-hidden="true" /></> : deliveryEnabled ? <>Send project enquiry<ArrowUpRight size={16} aria-hidden="true" /></> : <>Download project brief<Download size={16} aria-hidden="true" /></>}</button></div>{deliveryEnabled && <button type="button" className="download-alternative" disabled={status === "sending"} onClick={() => { const data = readForm(); if (data) downloadBrief(data); }}><Download size={12} aria-hidden="true" />Or download a copy of your brief</button>}{message && <div ref={statusRef} tabIndex={-1} className={`form-status ${status === "error" ? "status-error" : "status-success"}`} role={status === "error" ? "alert" : "status"}>{status === "error" ? <AlertCircle size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}<p>{message}</p></div>}<noscript><p className="form-availability">JavaScript is needed to validate and prepare this enquiry. You can still use the contact email alongside this form when it is available.</p></noscript></form>;
}
