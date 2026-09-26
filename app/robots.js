// The field kit at /field is an internal listing-appointment script, not
// public content, and its pages already carry a noindex — keeping crawlers
// out of it here too so it never shows up in results.

import { SITE_URL } from "./layout";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/field", "/field/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
