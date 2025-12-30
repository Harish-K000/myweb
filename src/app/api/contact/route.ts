import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "email", "message"] as const;

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>;

    for (const field of REQUIRED_FIELDS) {
      if (!payload[field] || typeof payload[field] !== "string") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const contactMessage = {
      name: payload.name?.trim(),
      email: payload.email?.trim(),
      company: payload.company?.trim() ?? "",
      message: payload.message?.trim(),
    };

    if (!process.env.RESEND_API_KEY || process.env.NODE_ENV !== "production") {
      console.info("[contact] New message received", contactMessage);
      return NextResponse.json({ ok: true, mode: "logged" });
    }

    // TODO: Wire up Resend integration once API key is configured.

    return NextResponse.json({ ok: true, mode: "queued" });
  } catch (error) {
    console.error("[contact] Failed to process request", error);
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 500 },
    );
  }
}

