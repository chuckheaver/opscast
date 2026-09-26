'use client';

// The landing page's address box. Deliberately the same component the map
// itself uses, so the autocomplete, the SF-first geocoding and the recent
// searches all behave identically — the only difference is that picking a
// result routes to the map instead of moving a pin in place.
//
// It hands the map the coordinates via the ?lat=&lng=&name= deep-link that
// /fog already supports, so the map opens with the pin dropped and the
// neighborhood pop-up open.

import { useRouter } from "next/navigation";
import FogLocationSearch from "../fog/FogLocationSearch";

export default function HeroSearch() {
  const router = useRouter();

  const go = (center, label) => {
    if (!Array.isArray(center)) return;
    const qs = new URLSearchParams({
      preset: "fog",
      lng: String(center[0]),
      lat: String(center[1]),
    });
    if (label) qs.set("name", label);
    router.push(`/fog?${qs.toString()}`);
  };

  return (
    <div className="hero-search">
      <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <FogLocationSearch
        onPickFromAddress={go}
        ready
        showGeoButton={false}
        placeholder="Where do you want to go?"
      />
    </div>
  );
}
