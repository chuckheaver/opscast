// The site-wide disclaimer, in the wording the owner approved. SiteFooter
// prints both paragraphs at the foot of every footer, /disclaimer prints them
// as a page, and LegalLine carries the short form on the full-screen map and
// tool apps that have no footer. Change the wording here and all three follow.
//
// The zone list at the end of the weather paragraph restates fog-zones.js —
// if a threshold moves there, move it here too.

export const DISCLAIMER_WEATHER_TITLE = "Weather and climate.";
export const DISCLAIMER_WEATHER =
  "Weather, fog and climate information on this site is for general information only. "
  + "Conditions vary widely from block to block, day to day and year to year. Fog zones, "
  + "fog hours and temperatures are approximations based on satellite data and observations "
  + "on the ground — not forecasts, readings at any one property, or guarantees. Summer fog "
  + "figures are daily totals averaged across the four summer months, compiled from about "
  + "26,000 hourly GOES satellite images provided by USGS and applied to observations on the "
  + "ground. Zones: 8 hrs or less Sun · 8.5 Transition · 9 – 11 Fog · over 11 Persistent Fog.";

export const DISCLAIMER_SALES_TITLE = "Sales data.";
export const DISCLAIMER_SALES =
  "Sales figures are closed sales reported to the SFAR MLS for the period shown, deemed "
  + "reliable but not guaranteed. They are not an appraisal or a broker price opinion and "
  + "should not be used to value a property — for that, ask a licensed agent for a "
  + "comparative market analysis, or order an appraisal. Not intended to solicit properties "
  + "currently listed with another broker.";

export const DISCLAIMER_SHORT = "Weather and sales data are approximations for information only";

// Both paragraphs in reading order, for the footer and the page.
export const DISCLAIMERS = [
  { title: DISCLAIMER_WEATHER_TITLE, text: DISCLAIMER_WEATHER },
  { title: DISCLAIMER_SALES_TITLE, text: DISCLAIMER_SALES },
];
