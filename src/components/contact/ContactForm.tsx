"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import {
  budgetOptions,
  projectTypes,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from "@/lib/enquiry";

export function ContactForm({
  initialProjectType,
}: {
  initialProjectType: string;
}) {
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [descriptionLength, setDescriptionLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  function readForm() {
    const result = validateEnquiry(
      Object.fromEntries(new FormData(formRef.current!)),
    );
    if (!result.success) {
      setErrors(result.errors);
      setStatus("idle");
      setMessage("");
      requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    setErrors({});
    return result.data;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = readForm();
    if (!data) return;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15_000),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
        errors?: EnquiryErrors;
      };
      if (!response.ok) {
        setErrors(result.errors ?? {});
        throw new Error(
          result.error || "We couldn’t confirm delivery. Please try again.",
        );
      }
      setStatus("sent");
      setMessage(
        result.message ||
          "Your enquiry has been sent. Thank you for sharing your idea.",
      );
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We couldn’t confirm delivery. Your details are still here; please try again.",
      );
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  function updateField(event: FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (
      !(field instanceof HTMLInputElement) &&
      !(field instanceof HTMLSelectElement) &&
      !(field instanceof HTMLTextAreaElement)
    )
      return;
    if (field.name === "description") setDescriptionLength(field.value.length);
    const name = field.name as keyof Enquiry;
    if (!errors[name]) return;
    const result = validateEnquiry(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (result.success || !result.errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  }

  const errorProps = (name: keyof Enquiry, hint?: string) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby":
      [hint, errors[name] ? `${name}-error` : ""].filter(Boolean).join(" ") ||
      undefined,
  });
  const errorText = (name: keyof Enquiry) =>
    errors[name] && (
      <span className="field-error" id={`${name}-error`}>
        Error: {errors[name]}
      </span>
    );

  return (
    <form
      ref={formRef}
      className="enquiry-form"
      aria-labelledby="contact-title"
      onSubmit={submit}
      onInput={updateField}
      onReset={() => setDescriptionLength(0)}
      noValidate
    >
      <div className="form-heading">
        <div>
          <h1 id="contact-title">Start a project</h1>
          <p>Tell us what you’d like to build and the problem it should solve.</p>
        </div>
        <span className="mono">REQUIRED FIELDS ARE LABELED</span>
      </div>
      {Object.keys(errors).length > 0 && (
        <div
          className="form-error-summary"
          ref={errorRef}
          tabIndex={-1}
          role="alert"
        >
          <strong>A few details need your attention.</strong>
          <ul>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                <a href={`#${key}`}>{error}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset disabled={status === "sending"} className="form-fields">
        <legend className="sr-only">Project enquiry details</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">
              Your name <span>(required)</span>
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
              minLength={2}
              maxLength={100}
              {...errorProps("name")}
            />
            {errorText("name")}
          </div>
          <div className="field">
            <label htmlFor="email">
              Email address <span>(required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="alex@company.com"
              required
              maxLength={254}
              {...errorProps("email")}
            />
            {errorText("email")}
          </div>
        </div>
        <div className="field">
          <label htmlFor="company">
            Company <span className="field-optional">Optional</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Where you’re building"
            maxLength={160}
            {...errorProps("company")}
          />
          {errorText("company")}
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="projectType">
              Project type <span>(required)</span>
            </label>
            <select
              id="projectType"
              name="projectType"
              defaultValue={initialProjectType}
              required
              {...errorProps("projectType")}
            >
              <option value="" disabled>
                Select a project type
              </option>
              {projectTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            {errorText("projectType")}
          </div>
          <div className="field">
            <label htmlFor="budget">
              Estimated budget <span className="field-optional">Optional</span>
            </label>
            <select
              id="budget"
              name="budget"
              defaultValue=""
              {...errorProps("budget")}
            >
              <option value="">Select a range</option>
              {budgetOptions.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
            {errorText("budget")}
          </div>
        </div>
        <div className="field">
          <label htmlFor="description">
            A little about your project <span>(required)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            minLength={30}
            maxLength={5000}
            placeholder="What would you like to build? Tell us about the challenge, the people it’s for, and what you hope to achieve."
            {...errorProps("description", "description-hint description-count")}
          />
          <span className="field-hint" id="description-hint">
            30–5,000 characters. Please leave out passwords or confidential
            information.
          </span>
          <span className="field-character-count" id="description-count">
            {descriptionLength.toLocaleString("en-US")} / 5,000 characters
          </span>
          {errorText("description")}
        </div>
        <div className="form-trap" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>
      <div className="form-submit-row">
        <p>
          Your details will be used to respond to your enquiry.{" "}
          <Link href="/privacy">Privacy Policy</Link>
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="button button-primary"
        >
          {status === "sending" ? (
            <>
              Sending enquiry
              <LoaderCircle size={16} className="spin" aria-hidden="true" />
            </>
          ) : (
            <>
              Send project enquiry
              <ArrowUpRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      {message && (
        <div
          ref={statusRef}
          tabIndex={-1}
          className={`form-status ${status === "error" ? "status-error" : "status-success"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {status === "error" ? (
            <AlertCircle size={18} aria-hidden="true" />
          ) : (
            <Check size={18} aria-hidden="true" />
          )}
          <p>{message}</p>
        </div>
      )}
      <noscript>
        <p className="form-availability">
          JavaScript is needed to submit this form. You can also email{" "}
          <a href="mailto:enquiries@sanoraworks.com">enquiries@sanoraworks.com</a>.
        </p>
      </noscript>
    </form>
  );
}
