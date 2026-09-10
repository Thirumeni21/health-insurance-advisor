import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthGuard • Family Protection Experience",
  description:
    "· cinematic, personalized family protection assessment experience designed to understand your household before medical emergency modeling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-midnight text-off-white bg-grid-subtle flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
