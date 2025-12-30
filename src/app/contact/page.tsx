
export default function ContactPage() {
  return (
    <main className="px-6 py-16">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="text-4xl font-semibold">Get in touch</h1>
        <p className="text-lg text-muted-foreground">
          Reach out if you have a project in mind or want to collaborate. I read
          every note.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-6 text-left">
            <h2 className="text-xl font-medium">Email</h2>
            <p className="mt-2 text-muted-foreground">
              <a
                className="underline underline-offset-4"
                href="mailto:hello@example.com"
              >
                hello@example.com
              </a>
            </p>
          </div>
          <div className="rounded-lg border p-6 text-left">
            <h2 className="text-xl font-medium">Social</h2>
            <p className="mt-2 text-muted-foreground">
              Follow along on{" "}
              <a
                className="underline underline-offset-4"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>{" "}
              and{" "}
              <a
                className="underline underline-offset-4"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
