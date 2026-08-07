import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SENDIT - Branded invites for the music industry",
  description: "SENDIT is the invite builder made for labels, management companies, and publishers. Design it, send the link, watch the RSVPs come in.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
