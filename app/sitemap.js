// Sitemap for the whole site, with every neighborhood guide page listed —
// those 105 pages are the reason the site is worth crawling, and nothing
// links to all of them except the guide index.
//
// SITE_URL is re-exported from the layout so the canonical domain stays in
// one place when chuckheaver.com is pointed here.

import { SITE_URL } from "./layout";
import { NAMES, slugify, dataThrough } from "./neighborhoods/lib";

export default function sitemap() {
  const lastModified = dataThrough ? new Date(dataThrough) : new Date();

  const core = [
    { url: "/", changeFrequency: "weekly", priority: 1 },
    { url: "/neighborhoods", changeFrequency: "weekly", priority: 0.9 },
    { url: "/property-types", changeFrequency: "monthly", priority: 0.85 },
    { url: "/fog", changeFrequency: "weekly", priority: 0.8 },
    { url: "/market/report", changeFrequency: "monthly", priority: 0.85 },
    { url: "/instagram", changeFrequency: "daily", priority: 0.5 },
    { url: "/market", changeFrequency: "weekly", priority: 0.8 },
    { url: "/microclimates", changeFrequency: "monthly", priority: 0.85 },
    { url: "/microclimates/zones", changeFrequency: "monthly", priority: 0.6 },
    { url: "/weather", changeFrequency: "monthly", priority: 0.5 },
    { url: "/tools", changeFrequency: "monthly", priority: 0.5 },
    { url: "/wine", changeFrequency: "monthly", priority: 0.4 },
  ].map(e => ({ ...e, url: SITE_URL + e.url, lastModified }));

  const hoods = NAMES.map(name => ({
    url: `${SITE_URL}/neighborhoods/${slugify(name)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...core, ...hoods];
}
