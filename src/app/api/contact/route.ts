import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().max(100).optional(),
    email: z.string().trim().email(),
    message: z.string().trim().min(10).max(2000),
});

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
    console.info("Contact form submission received.", {
        name: name || "Anonymous",
        email,
        messageLength: message.length,
    });

    return NextResponse.json({ ok: true });
}
