import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script"; // ↳ uncomment alongside the <Script> tag below when going live with Plausible
import "./globals.css";

// Geist fonts ship with the scaffold; kept available via CSS variables in case
// we want them later. The OpsCast UI uses DM Sans + DM Mono (loaded in globals.css).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OpsCast — Business Weather Intelligence",
  description:
    "Weather forecasting built for outdoor business operations. Set your ideal conditions and get operational guidance hour by hour.",
  openGraph: {
    title: "OpsCast — Business Weather Intelligence",
    description:
      "Weather forecasting built for outdoor business operations. Set your ideal conditions and get operational guidance hour by hour.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpsCast — Business Weather Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpsCast — Business Weather Intelligence",
    description:
      "Weather forecasting built for outdoor business operations. Set your ideal conditions and get operational guidance hour by hour.",
    images: ["/og-image.png"],
  },
};

// In Next.js 16, viewport is a separate export from metadata.
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Plausible Analytics — uncomment (and the import above) once the domain is live */}
        {/* <Script defer data-domain="opscast.app" src="https://plausible.io/js/script.js" /> */}
      </body>
    </html>
  );
}
