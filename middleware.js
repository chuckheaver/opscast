// Host-based routing so a single codebase serves two domains:
//   FORECAST_HOSTS → weather forecast at "/", nothing else
//   MAPS_HOSTS     → landing hub at "/", plus /fog /microclimates /winecountry
// Both domains share every static asset, every /api route, and every
// Mapbox / geojson file — those short-circuit via the matcher.
//
// Domains are configured via environment variables (below) so the
// second, "maps" domain can change without a code push:
//
//   NEXT_PUBLIC_FORECAST_HOSTS   = "ur4cast.com,www.ur4cast.com"
//   NEXT_PUBLIC_FORECAST_ORIGIN  = "https://ur4cast.com"
//   NEXT_PUBLIC_MAPS_HOSTS       = "yourmaps.com,www.yourmaps.com"
//   NEXT_PUBLIC_MAPS_ORIGIN      = "https://yourmaps.com"
//
// Preview hosts (*.vercel.app, localhost, any host not listed in the
// env vars) get NO domain routing — every path browses freely there.
// So if the env vars aren't set, this middleware is a pure no-op.
//
// Redirects are permanent (308) so search engines learn the canonical
// home for each map and old bookmarks don't dead-end.

import { NextResponse } from "next/server";

const FORECAST_HOSTS = parseHosts(process.env.NEXT_PUBLIC_FORECAST_HOSTS);
const MAPS_HOSTS     = parseHosts(process.env.NEXT_PUBLIC_MAPS_HOSTS);
const FORECAST_ORIGIN = process.env.NEXT_PUBLIC_FORECAST_ORIGIN || "";
const MAPS_ORIGIN     = process.env.NEXT_PUBLIC_MAPS_ORIGIN     || "";

// Routes the map-only site owns. Serve them on the maps host; on the
// forecast host, punt over to the maps host instead.
const MAP_ROUTES = ["/fog", "/microclimates", "/winecountry", "/wine", "/hub"];
const isMapRoute = path =>
  MAP_ROUTES.some(r => path === r || path.startsWith(r + "/"));

function parseHosts(csv) {
  return new Set((csv || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean));
}

export function middleware(request) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const { pathname, search } = request.nextUrl;

  if (FORECAST_HOSTS.has(host)) {
    // Forecast host serves only the forecast tool. Every map path lives
    // at the maps host — send visitors (and their bookmarks) over.
    if (isMapRoute(pathname) && MAPS_ORIGIN) {
      return NextResponse.redirect(new URL(pathname + search, MAPS_ORIGIN), 308);
    }
    return NextResponse.next();
  }

  if (MAPS_HOSTS.has(host)) {
    // Maps host: root is the landing hub (rewrite so URL stays "/"),
    // and the forecast route redirects back to the forecast host.
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/hub", request.url));
    }
    if (pathname === "/settings" && FORECAST_ORIGIN) {
      return NextResponse.redirect(new URL(pathname + search, FORECAST_ORIGIN), 308);
    }
    return NextResponse.next();
  }

  // Preview / local / unconfigured hosts: no routing, every path serves
  // as-is so testing stays browseable.
  return NextResponse.next();
}

export const config = {
  // Skip Next internals + API + static /data GeoJSON so map sources are
  // served identically on both domains and never redirected.
  matcher: [
    "/((?!_next/|api/|data/|favicon\\.ico|robots\\.txt|sitemap\\.xml|og-image\\.png).*)",
  ],
};
