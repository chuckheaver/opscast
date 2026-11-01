"use client";

// A sideways-scrolling box (a wide chart or table on a phone) with a cue that
// there is more to see: a fade and an arrow at each edge that has more, and,
// until the reader first scrolls, a chip — "Swipe ↔" with a phone-turn icon
// suggesting landscape when the phone is upright. Nothing shows when the
// content fits.

import { useEffect, useRef, useState } from "react";

const PhoneTurn = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="hs-phone">
    <rect x="7.5" y="3" width="9" height="15" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <line x1="10.6" y1="15.6" x2="13.4" y2="15.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M18.6 9.2a6.4 6.4 0 0 1 1.6 6.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21.4 14.2l-1.2 1.9-1.9-1.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HScroll({ className = "", children }) {
  const ref = useRef(null);
  const [st, setSt] = useState({ l: false, r: false, tall: false });
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // A box taller than most of the screen (a long table) keeps its cue pinned
    // mid-screen while the page scrolls past it.
    const upd = () => setSt({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4, tall: el.offsetHeight > window.innerHeight * 0.8 });
    const onScroll = () => { upd(); if (el.scrollLeft > 4) setMoved(true); };
    upd();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    for (const c of el.children) ro.observe(c);
    return () => { el.removeEventListener("scroll", onScroll); ro.disconnect(); };
  }, []);
  const nudge = d => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.7, behavior: "smooth" });
  const cues = (
    <>
      {st.l ? <button type="button" className="hs-btn hs-btn-l" onClick={() => nudge(-1)} aria-label="Scroll left">‹</button> : null}
      {st.r ? <button type="button" className="hs-btn hs-btn-r" onClick={() => nudge(1)} aria-label="Scroll right">›</button> : null}
      {st.r && !moved ? (
        <span className="hs-chip" aria-hidden="true"><PhoneTurn /><b>Swipe ↔</b><i> or turn your phone</i></span>
      ) : null}
    </>
  );
  return (
    <div className={`hs${st.l ? " hs-l" : ""}${st.r ? " hs-r" : ""}`}>
      {st.tall ? <div className="hs-rail">{cues}</div> : null}
      <div ref={ref} className={className}>{children}</div>
      {st.tall ? null : cues}
    </div>
  );
}
