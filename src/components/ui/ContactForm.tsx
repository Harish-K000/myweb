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
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                    <p className="text-lg font-semibold text-[var(--color-brand-text)]">Message sent!</p>
                    <p className="text-sm text-[var(--color-brand-muted)] mt-1">
                        I&apos;ll get back to you within 48 hours.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setFormState("idle")}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
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
                    <label htmlFor="contact-name" className="block font-mono-ui text-xs uppercase tracking-[0.15em] text-cyan-400/80 mb-1.5">
                        NAME_INPUT
                    </label>
                    <input
                        type="text"
                        id="contact-name"
                        name="name"
                        placeholder="Your name"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm font-mono-ui focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-[var(--color-brand-muted)]/50"
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="contact-email" className="block font-mono-ui text-xs uppercase tracking-[0.15em] text-cyan-400/80 mb-1.5">
                        EMAIL_INPUT <span className="text-cyan-400">*</span>
                    </label>
                    <input
                        type="email"
                        id="contact-email"
                        name="email"
                        required
                        placeholder="your@email.com"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm font-mono-ui focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-[var(--color-brand-muted)]/50"
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="contact-message" className="block font-mono-ui text-xs uppercase tracking-[0.15em] text-cyan-400/80 mb-1.5">
                        MESSAGE_INPUT <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        placeholder="What are you building?"
                        className="w-full input-surface border rounded-md px-4 py-3 text-sm font-mono-ui focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder:text-[var(--color-brand-muted)]/50 resize-none"
                        disabled={formState === "submitting"}
                    />
                </div>

                {/* Error state */}
                {formState === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={formState === "submitting"}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono-ui text-sm font-bold uppercase tracking-[0.1em] py-3.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
