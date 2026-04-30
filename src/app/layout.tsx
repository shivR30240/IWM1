import type { Metadata, Viewport } from "next";
import { Inter, Hind } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indore Voice-Connect | Civic Complaint Helpline",
  description: "Report civic issues in Indore with just a phone call. Voice-first civic complaint platform.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hind.variable} bg-background`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fafafa',
              border: '1px solid #27272a',
              borderRadius: '12px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#00d4aa',
                secondary: '#0a0a0a',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0a0a0a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
