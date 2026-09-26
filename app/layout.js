import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script"; // ↳ uncomment alongside the <Script> tag below when going live with Plausible
import "./globals.css";

// Geist fonts ship with the scaffold; kept available via CSS variables in case
// we want them later. The Ur4cast UI uses DM Sans + DM Mono (loaded in globals.css).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Chuck Heaver — San Francisco Realtor & Meteorologist";
const DESC =
  "Every San Francisco block has its own microclimate. Twenty years forecasting this coastline, "
  + "thirty-five selling homes on it — with every closed sale in the city mapped to the sun, wind and fog it sits in.";

export const metadata = {
  // Production canonical domain. Relative URLs in metadata (like
  // /og-image.png) resolve against this when rendered on any deploy.
  metadataBase: new URL("https://www.ur4cast.com"),
  title: { default: TITLE, template: "%s" },
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: "https://www.ur4cast.com",
    siteName: "Chuck Heaver · San Francisco",
    locale: "en_US",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
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
        {/* <Script defer data-domain="ur4cast.com" src="https://plausible.io/js/script.js" /> */}
      </body>
    </html>
  );
}
