import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Shared chrome for the main portfolio site. Routes outside this group
// (e.g. /securify) render full-screen with no nav/footer.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
        </>
    );
}
