import type { Metadata } from "next";
import SecurifyHero from "@/components/securify/SecurifyHero";

export const metadata: Metadata = {
    title: "Securify — hero demo",
    robots: { index: false, follow: false },
};

// Standalone demo for the "Securify" SaaS hero spec — intentionally isolated
// from the rest of the portfolio (own fonts/colors via SecurifyHero), not
// linked from the site's nav.
export default function SecurifyDemoPage() {
    return <SecurifyHero />;
}
