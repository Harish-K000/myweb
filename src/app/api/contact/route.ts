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
    const sender = name || "Anonymous";

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
        console.error("Contact form is not configured: missing RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL.");
        return NextResponse.json(
            { error: "Message delivery is not configured yet. Please email directly instead." },
            { status: 500 }
        );
    }

    try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from,
            to,
            replyTo: email,
            subject: `Portfolio contact form: ${sender}`,
            text: `From: ${sender} <${email}>\n\n${message}`,
            html: `<p><strong>From:</strong> ${escapeHtml(sender)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
        });

        if (error) {
            console.error("Resend failed to send contact message.", error);
            return NextResponse.json(
                { error: "Unable to send message. Please try again later." },
                { status: 502 }
            );
        }
    } catch (err) {
        console.error("Unexpected error sending contact message.", err);
        return NextResponse.json(
            { error: "Unable to send message. Please try again later." },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true });
}
