import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().max(100).optional(),
    email: z.string().trim().email(),
    message: z.string().trim().min(10).max(2000),
});

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const result = contactSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: "Invalid form submission." },
            { status: 400 }
        );
    }

    const { name, email, message } = result.data;
    const displayName = name || "Anonymous";

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
        console.error(
            "Contact form is misconfigured: missing RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL."
        );
        return NextResponse.json(
            { error: "The contact form isn't set up yet. Please reach out via email or LinkedIn instead." },
            { status: 503 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const { error } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            replyTo: email,
            subject: `New portfolio message from ${displayName}`,
            html: `
                <p><strong>Name:</strong> ${escapeHtml(displayName)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
            `,
        });

        if (error) {
            console.error("Resend failed to send contact email.", error);
            return NextResponse.json(
                { error: "Unable to send message right now. Please try again later." },
                { status: 502 }
            );
        }
    } catch (error) {
        console.error("Unexpected error sending contact email.", error);
        return NextResponse.json(
            { error: "Unable to send message right now. Please try again later." },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true });
}
