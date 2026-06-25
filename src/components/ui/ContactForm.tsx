"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
    className?: string;
};

export default function ContactForm({ className = "" }: ContactFormProps) {
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormState("submitting");
        setErrorMessage("");

        const formData = new FormData(event.currentTarget);
        const payload = {
            name: String(formData.get("name") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            message: String(formData.get("message") ?? "").trim(),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data?.error ?? "Unable to send message.");
            }

            setFormState("success");
            (event.target as HTMLFormElement).reset();
        } catch (error) {
            setFormState("error");
            setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
        }
    };

    if (formState === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(214,168,79,0.1)", border: "1px solid rgba(214,168,79,0.3)" }}
                >
                    <CheckCircle2 className="w-7 h-7" style={{ color: "var(--color-brand-primary)" }} />
                </div>
                <div>
                    <p className="font-display text-lg font-semibold text-[var(--color-brand-text)]">The raven has flown.</p>
                    <p className="text-sm text-[var(--color-brand-muted)] mt-1">
                        I&apos;ll get back to you within 48 hours.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setFormState("idle")}
                    className="text-sm hover:opacity-80 transition-opacity underline underline-offset-2"
                    style={{ color: "var(--color-brand-primary)" }}
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
                {/* Name */}
                <div>
                    <label htmlFor="contact-name" className="block text-xs uppercase tracking-[0.15em] mb-1.5" style={{ color: "var(--color-brand-muted)" }}>
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="contact-name"
                        name="name"
                        placeholder="Who approaches the gate?"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-[var(--color-brand-muted)]/50"
                        style={{ "--tw-ring-color": "rgba(214,168,79,0.3)" } as React.CSSProperties}
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-[0.15em] mb-1.5" style={{ color: "var(--color-brand-muted)" }}>
                        Your Email <span style={{ color: "var(--color-brand-primary)" }}>*</span>
                    </label>
                    <input
                        type="email"
                        id="contact-email"
                        name="email"
                        required
                        placeholder="your@email.com"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-[var(--color-brand-muted)]/50"
                        style={{ "--tw-ring-color": "rgba(214,168,79,0.3)" } as React.CSSProperties}
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="contact-message" className="block text-xs uppercase tracking-[0.15em] mb-1.5" style={{ color: "var(--color-brand-muted)" }}>
                        Your Message <span style={{ color: "var(--color-brand-primary)" }}>*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        placeholder="What are you building?"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-[var(--color-brand-muted)]/50 resize-none"
                        style={{ "--tw-ring-color": "rgba(214,168,79,0.3)" } as React.CSSProperties}
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Error state */}
                {formState === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={formState === "submitting"}
                    className="w-full flex items-center justify-center gap-2 font-display text-sm font-bold uppercase tracking-[0.1em] py-3.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    style={{ background: "var(--color-brand-primary)", color: "#1f1710" }}
                >
                    {formState === "submitting" ? (
                        <>
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" /> Send Message
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
