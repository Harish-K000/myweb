"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("companyWebsite")) {
      // Honeypot triggered; pretend success to bots
      setStatus("success");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send message right now. Please try email.");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please retry or email me directly.",
      );
    }
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </div>
      <Field label="Company / Team" name="company" />
      <Field
        label="How can I help?"
        name="message"
        as="textarea"
        rows={5}
        required
      />

      <div className="hidden">
        <label htmlFor="companyWebsite" className="sr-only">
          Company website
        </label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      {status === "success" ? (
        <p className="text-sm font-medium text-emerald-600">
          Thanks! I’ll reply within 24 hours.
        </p>
      ) : null}

      {status === "error" && error ? (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      ) : null}
    </form>
  );
}

type FieldProps =
  | ({
      as?: "input";
      label: string;
    } & React.InputHTMLAttributes<HTMLInputElement> & { name: string })
  | ({
      as: "textarea";
      label: string;
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string });

function Field({ label, name, as = "input", className, ...props }: FieldProps) {
  if (as === "textarea") {
    const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <label className="block text-sm font-medium text-slate-700">
        {label}
        <textarea
          name={name}
          className={cn(
            "min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-slate-100/60 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
            className,
          )}
          {...textareaProps}
        />
      </label>
    );
  }

  const inputProps = props as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        className={cn(
          "h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm ring-1 ring-slate-100/60 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
          className,
        )}
        {...inputProps}
      />
    </label>
  );
}
