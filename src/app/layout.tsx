import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const defaultTitle = `${PORTFOLIO_DATA.profile.name} | ${PORTFOLIO_DATA.profile.title}`;
const description = PORTFOLIO_DATA.profile.tagline;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: defaultTitle,
        template: `%s | ${PORTFOLIO_DATA.profile.name}`,
    },
    description,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: defaultTitle,
        description,
        url: siteUrl,
        siteName: PORTFOLIO_DATA.profile.name,
        images: [
            {
                url: "/og-image.svg",
                width: 1200,
                height: 630,
                alt: `${PORTFOLIO_DATA.profile.name} portfolio`,
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description,
        images: ["/og-image.svg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: PORTFOLIO_DATA.profile.name,
        url: siteUrl,
        jobTitle: PORTFOLIO_DATA.profile.title,
        email: PORTFOLIO_DATA.profile.social.email,
        sameAs: [
            PORTFOLIO_DATA.profile.social.github,
            PORTFOLIO_DATA.profile.social.linkedin,
        ],
    };

    const themeScript = `
        (function () {
            try {
                var stored = localStorage.getItem("theme");
                var theme = stored === "light" || stored === "dark"
                    ? stored
                    : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
            } catch (e) {}
        })();
    `;

    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            </head>
            <body className="antialiased">
                <Header />
                <main className="min-h-screen pt-16">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
