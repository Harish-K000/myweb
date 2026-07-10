"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ className = "" }: { className?: string }) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name:    String(fd.get("name")    ?? "").trim(),
      email:   String(fd.get("email")   ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Unable to send message.");
      }
      setFormState("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--green-dim)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <CheckCircle2 size={26} style={{ color: "var(--green)" }} />
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
            Message sent!
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            I&apos;ll get back to you within 48 hours.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormState("idle")}
          className="text-sm font-medium cursor-pointer transition-opacity duration-200 hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    width: "100%",
    padding: "12px 16px",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "8px",
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="cf-name" style={labelStyle}>Name</label>
          <input
            type="text"
            id="cf-name"
            name="name"
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-strong)"; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="cf-email" style={labelStyle}>
            Email <span style={{ color: "var(--text-subtle)" }}>*</span>
          </label>
          <input
            type="email"
            id="cf-email"
            name="email"
            required
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-strong)"; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="cf-message" style={labelStyle}>
            Message <span style={{ color: "var(--text-subtle)" }}>*</span>
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            placeholder="What are you building?"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-strong)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
            disabled={formState === "submitting"}
          />
        </div>

        {formState === "error" && (
          <div
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
            style={{
              background: "var(--red-dim)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "var(--red)",
            }}
          >
            <AlertCircle size={15} className="shrink-0" />
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={formState === "submitting"}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
          onMouseEnter={(e) => { if (formState !== "submitting") (e.currentTarget as HTMLElement).style.background = "var(--cta-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cta-bg)"; }}
        >
          {formState === "submitting" ? (
            <>
              <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
