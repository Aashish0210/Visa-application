import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";
import MobileBottomNav from "@/components/MobileBottomNav";

// Wraps every public-facing page with the site Navbar, Footer, and Chatbot.
// The /admin route group has its own layout and is NOT included here.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <Chatbot />
        </>
    );
}
