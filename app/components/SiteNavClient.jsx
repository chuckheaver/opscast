"use client";

// Site menu. Desktop: a row of links with two dropdowns (Microclimates and
// Neighborhoods) that open on hover or click. Phone: a ☰ button that opens a
// full-width panel with the same items, dropdowns expanding in place.
// Escape, a click outside, or following a link closes everything.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EMAIL } from "./SiteFooter";

const MICRO = [
  { href: "/microclimates#climate", label: "Climate", sub: "Köppen, the ocean, the year" },
  { href: "/microclimates#bay", label: "Bay Micro", sub: "The Bay Area's microclimates" },
  { href: "/microclimates#sf", label: "SF Micro", sub: "Three belts, your block, sun on the lot" },
  { href: "/microclimates#fog", label: "Fog Map", sub: "How fog forms and moves" },
];

const MARKET = [
  { href: "/market/report#sf", label: "SF Market", sub: "Market stats, grids, by the numbers, inventory" },
  { href: "/market/report#neighborhoods", label: "SF Neighborhoods", sub: "Every sale by neighborhood and fog zone" },
  { href: "/market/report#national", label: "National Mkts", sub: "Rates, Treasuries, inflation, jobs" },
];

export default function SiteNavClient({ hoods, guide }) {
  const [open, setOpen] = useState(null);          // "micro" | "hoods" | "guide" | "market" | null
  const [mobile, setMobile] = useState(false);     // phone panel
  const ref = useRef(null);
  const path = usePathname();
  // The home page lays the menu over its hero without a logo — the name is
  // right there in the hero. Everywhere else it is a solid bar.
  const bare = path === "/";

  useEffect(() => { setOpen(null); setMobile(false); }, [path]);
  // Publish the bar's height as --nv-h so full-screen map apps can start
  // below it instead of underneath it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--nv-h", bare ? "0px" : `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bare]);
  useEffect(() => {
    const key = e => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    const click = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", click); };
  }, []);

  // Group the neighborhoods by first letter for the A–Z panel.
  const letters = [];
  for (const h of hoods) {
    const L = h.name[0].toUpperCase();
    if (!letters.length || letters[letters.length - 1].L !== L) letters.push({ L, items: [] });
    letters[letters.length - 1].items.push(h);
  }

  const closeAll = () => { setOpen(null); setMobile(false); };
  const hover = key => ({
    onMouseEnter: () => window.matchMedia("(hover: hover)").matches && setOpen(key),
    onMouseLeave: () => window.matchMedia("(hover: hover)").matches && setOpen(null),
  });
  const toggle = key => () => setOpen(o => (o === key ? null : key));

  return (
    <header ref={ref} className={`nv${bare ? " nv-bare" : ""}${mobile ? " is-mobile-open" : ""}`}>
      <div className="nv-bar">
        {!bare && (
          <Link href="/" className="nv-logo" onClick={closeAll}>
            <span className="nv-logo-name">Chuck Heaver</span>
            <span className="nv-logo-sub">San Francisco Realtor · Meteorologist</span>
          </Link>
        )}
        <button type="button" className="nv-burger" aria-expanded={mobile} aria-controls="nv-menu"
                onClick={() => setMobile(m => !m)}>
          <span aria-hidden="true">{mobile ? "✕" : "☰"}</span>
          <span className="nv-burger-t">Menu</span>
        </button>

        <nav id="nv-menu" className="nv-menu" aria-label="Site">
          <ul className="nv-list">
            <li><Link href="/" className="nv-link" onClick={closeAll}>Home</Link></li>

            <li className={`nv-dd${open === "micro" ? " is-open" : ""}`} {...hover("micro")}>
              <button type="button" className="nv-link nv-dd-btn" aria-expanded={open === "micro"} onClick={toggle("micro")}>
                Microclimates <span className="nv-caret" aria-hidden="true">▾</span>
              </button>
              <div className="nv-panel nv-panel-micro">
                {MICRO.map(m => (
                  <Link key={m.href} href={m.href} className="nv-item" onClick={closeAll}>
                    <b>{m.label}</b><span>{m.sub}</span>
                  </Link>
                ))}
              </div>
            </li>

            <li className={`nv-dd${open === "hoods" ? " is-open" : ""}`} {...hover("hoods")}>
              <button type="button" className="nv-link nv-dd-btn" aria-expanded={open === "hoods"} onClick={toggle("hoods")}>
                Neighborhoods <span className="nv-caret" aria-hidden="true">▾</span>
              </button>
              <div className="nv-panel nv-panel-hoods">
                <Link href="/neighborhoods" className="nv-all" onClick={closeAll}>All neighborhoods &rarr;</Link>
                <div className="nv-az">
                  {letters.map(g => (
                    <div key={g.L} className="nv-az-g">
                      <span className="nv-az-L">{g.L}</span>
                      {g.items.map(h => (
                        <Link key={h.slug} href={`/neighborhoods/${h.slug}`} onClick={closeAll}>{h.name}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li><Link href="/fog?preset=fog" className="nv-link" onClick={closeAll}>The Map</Link></li>
            <li className={`nv-dd${open === "guide" ? " is-open" : ""}`} {...hover("guide")}>
              <button type="button" className="nv-link nv-dd-btn" aria-expanded={open === "guide"} onClick={toggle("guide")}>
                Buyer Guide <span className="nv-caret" aria-hidden="true">▾</span>
              </button>
              <div className="nv-panel nv-panel-guide">
                <Link href="/property-types" className="nv-all" onClick={closeAll}>The full guide &rarr;</Link>
                <div className="nv-guide">
                  <div>
                    <span className="nv-az-L">Types of property</span>
                    {guide.types.map(t => (
                      <Link key={t.id} href={`/property-types#${t.id}`} onClick={closeAll}>{t.label}</Link>
                    ))}
                  </div>
                  <div>
                    <span className="nv-az-L">Buying</span>
                    {guide.topics.map(t => (
                      <Link key={t.id} href={`/property-types#${t.id}`} onClick={closeAll}>{t.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
            <li className={`nv-dd${open === "market" ? " is-open" : ""}`} {...hover("market")}>
              <button type="button" className="nv-link nv-dd-btn" aria-expanded={open === "market"} onClick={toggle("market")}>
                Market <span className="nv-caret" aria-hidden="true">▾</span>
              </button>
              <div className="nv-panel nv-panel-micro nv-panel-right">
                {MARKET.map(m => (
                  <Link key={m.href} href={m.href} className="nv-item" onClick={closeAll}>
                    <b>{m.label}</b><span>{m.sub}</span>
                  </Link>
                ))}
                <div className="nv-panel-foot">
                  <a href="/reports/sf-market-briefing.pdf" download>Download the PDF</a>
                </div>
              </div>
            </li>
            <li>
              <a href="https://www.instagram.com/chuckheaver/" className="nv-link nv-ig" target="_blank" rel="noopener noreferrer"
                 aria-label="Instagram — @chuckheaver" title="@chuckheaver on Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
                </svg>
                <span className="nv-ig-t">Instagram</span>
              </a>
            </li>
            <li><a href={`mailto:${EMAIL}`} className="nv-cta">Work With Me</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
