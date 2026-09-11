import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "HealthGuard • Family Protection Experience",
  description:
    "A clear, personalized family protection assessment experience designed to understand your household before medical emergency modeling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink flex flex-col antialiased selection:bg-[#EEE6FB] selection:text-ink">
        {children}
      </body>
    </html>
  );
}
