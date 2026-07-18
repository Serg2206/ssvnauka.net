"use client";

import { useState } from "react";
import { type Locale, getLocaleCopy } from "@/lib/site-data";

type State = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

export function IntakeForm({ locale }: { locale: Locale }) {
  const copy = getLocaleCopy(locale);
  const [state, setState] = useState<State>({ status: "idle", message: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Request failed");
      }

      form.reset();
      setState({ status: "success", message: payload.message || "Request received." });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Unexpected error" });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span>{copy.clinic.intake.fullName}</span>
          <input name="fullName" type="text" autoComplete="name" required minLength={2} maxLength={120} />
        </label>
        <label className="field">
          <span>{copy.clinic.intake.contactValue}</span>
          <input name="contactValue" type="text" autoComplete="email" required minLength={5} maxLength={120} />
        </label>
      </div>
      <label className="field">
        <span>{copy.clinic.intake.preferredContact}</span>
        <select name="contactMethod" defaultValue="email" required>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="telegram">Telegram</option>
        </select>
      </label>
      <label className="field">
        <span>{copy.clinic.intake.summary}</span>
        <textarea name="summary" required minLength={10} maxLength={1000} placeholder="Briefly describe the reason for the consultation." />
      </label>
      <input name="locale" type="hidden" value={locale} />
      <input name="honeypot" type="text" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      <label className="check-row">
        <input name="consentData" type="checkbox" value="yes" required />
        <span>{copy.clinic.consentCopy}</span>
      </label>
      <label className="check-row">
        <input name="consentPrivacy" type="checkbox" value="yes" required />
        <span>{copy.clinic.privacyCopy}</span>
      </label>
      <button className="button button--primary button--full" type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? copy.clinic.intake.sending : copy.clinic.intake.submit}
      </button>
      <p className={`form-status form-status--${state.status}`} aria-live="polite">
        {state.message || copy.clinic.disclaimer}
      </p>
    </form>
  );
}
