import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Official Nepal Long-Term Visa Portal | Department of Immigration",
    description: "Secure online platform for foreign nationals to apply for long-term visas for Nepal before arrival. Official government-grade visa application system.",
    keywords: ["Nepal Visa", "Long-term Visa", "Immigration Nepal", "Online Visa Application", "Nepal Government"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} font-sans`}>
                <NextTopLoader
                    color="#D4AF37"
                    initialPosition={0.08}
                    crawlSpeed={100}
                    height={4}
                    crawl={true}
                    showSpinner={false}
                    easing="ease-in-out"
                    speed={150}
                    shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
                />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

