"use client";

// The presentation's two ways of watching: Slides (one at a time, full screen,
// arrow keys / space / swipe, for presenting and the voice-over) and Scroll (the
// same slides stacked as a page, for anyone browsing). Phones open in Scroll;
// wide screens in Slides. #3 in the URL opens slide 3 and follows the deck.
//
// The slides are the page's children (server-rendered, from the site's existing
// graphics and copy); this only shows them.

import { Children, useCallback, useEffect, useRef, useState } from "react";

export default function Deck({ meta, children }) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const [mode, setMode] = useState(null);        // "slides" | "scroll", set on mount
  const [i, setI] = useState(0);
  const deckRef = useRef(null);
  const touch = useRef(null);

  // Mode by screen; slide from the URL.
  useEffect(() => {
    const h = parseInt((window.location.hash || "").slice(1), 10);
    if (Number.isFinite(h) && h >= 1 && h <= n) setI(h - 1);
    setMode(window.matchMedia("(min-width: 900px) and (min-height: 560px)").matches ? "slides" : "scroll");
  }, [n]);

  const go = useCallback(k => setI(v => Math.max(0, Math.min(n - 1, typeof k === "function" ? k(v) : k))), [n]);

  useEffect(() => {
    if (mode !== "slides") return;
    window.history.replaceState(null, "", `#${i + 1}`);
    // Each slide opens at its top, scaled to fill the screen: up for a short
    // slide, down for a long one (to no less than 60%; past that it scrolls).
    const box = deckRef.current?.querySelector(".dk-slide.is-on .dk-in");
    const fit = box?.querySelector(".dk-fit");
    if (!box || !fit) return;
    // A uniform scale (graphics and type together), with the space it frees
    // taken back so the slide still centres.
    const size = () => {
      fit.style.transform = ""; fit.style.marginBottom = "";
      const cs = getComputedStyle(box);
      const room = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const need = fit.offsetHeight;
      const roomW = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // Up to 1.3× for a short slide (never wider than the screen), down to 0.6× for a long one.
      const z = Math.max(0.6, Math.min(1.3, room / need, roomW / fit.offsetWidth));
      if (Math.abs(z - 1) > 0.02) {
        fit.style.transform = `scale(${z})`;
        fit.style.marginBottom = `${-(1 - z) * need}px`;
      }
      box.scrollTo(0, 0);
    };
    size();
    const t = setTimeout(size, 400);             // after images settle
    window.addEventListener("resize", size);
    return () => { clearTimeout(t); window.removeEventListener("resize", size); };
  }, [i, mode]);

  useEffect(() => {
    if (mode !== "slides") return;
    const onKey = e => {
      if (e.target.closest?.("input, select, textarea")) return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); go(v => v + 1); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(v => v - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(n - 1);
      else if (e.key === "f" || e.key === "F") toggleFull();
      else if (e.key === "Escape" && !document.fullscreenElement) setMode("scroll");
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [mode, go, n]);

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else deckRef.current?.requestFullscreen?.().catch(() => {});
  };

  const onTouchStart = e => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = e => {
    if (!touch.current) return;
    const t = e.changedTouches[0], dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(v => v + (dx < 0 ? 1 : -1));
  };

  const sec = meta[i]?.section;

  if (mode === "slides") {
    return (
      <div className="dk dk-on" ref={deckRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="dk-stage">
          {slides.map((s, k) => (
            <div key={k} className={`dk-slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i} inert={k !== i ? "" : undefined}>{s}</div>
          ))}
        </div>
        <div className="dk-bar">
          <div className="dk-prog" aria-hidden="true"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
          <div className="dk-ctl">
            <span className="dk-sec">{sec}</span>
            <button type="button" className="dk-b" onClick={() => go(v => v - 1)} disabled={i === 0} aria-label="Previous slide">‹</button>
            <span className="dk-count">{i + 1} / {n}</span>
            <button type="button" className="dk-b" onClick={() => go(v => v + 1)} disabled={i === n - 1} aria-label="Next slide">›</button>
            <select className="dk-jump" value={i} onChange={e => go(+e.target.value)} aria-label="Go to slide">
              {meta.map((m, k) => <option key={k} value={k}>{k + 1}. {m.title}</option>)}
            </select>
            <button type="button" className="dk-t" onClick={toggleFull}>Full screen</button>
            <button type="button" className="dk-t" onClick={() => setMode("scroll")}>Scroll view</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dk dk-scroll">
      {mode ? (
        <div className="dk-scroll-bar">
          <button type="button" className="lp-btn lp-btn-gold" onClick={() => { setI(0); setMode("slides"); }}>▶ Play as slides</button>
        </div>
      ) : null}
      {slides.map((s, k) => <div key={k} className="dk-slide" id={`s${k + 1}`}>{s}</div>)}
    </div>
  );
}
