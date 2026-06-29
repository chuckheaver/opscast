// The "San Francisco Market Update" PDF document, built from buildReportData().
// Written with React.createElement (no JSX) so it renders both in the browser
// (download) and in Node (renderToBuffer, for verification). Clean / unbranded.

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const h = React.createElement;

const INK = "#1c1917", MUTED = "#78716c", LINE = "#e7e5e4", ACCENT = "#1d4ed8";
const UP = "#16a34a", DOWN = "#b91c1c", BOX = "#f5f3ee";

const usd = n => (n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"));
const usdShort = n => {
  if (n == null) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
};
const intf = n => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));
const pctf = n => (n == null ? "—" : n.toFixed(1) + "%");
const fmtVal = (v, fmt) => (fmt === "usd" ? usd(v) : fmt === "pct" ? pctf(v) : intf(v));
const fmtDelta = d => (d == null ? "n/a" : (d >= 0 ? "+" : "") + d.toFixed(1) + "%");
const deltaColor = d => (d == null ? MUTED : d >= 0 ? UP : DOWN);

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 54, paddingHorizontal: 48, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  footer: { position: "absolute", bottom: 26, left: 48, right: 48, fontSize: 7.5, color: MUTED, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  kicker: { fontSize: 11, letterSpacing: 3, color: MUTED, fontFamily: "Helvetica-Bold" },
  h1: { fontSize: 34, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginTop: 6 },
  h2: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  sub: { fontSize: 10, color: MUTED, marginBottom: 14 },
  segName: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 6, marginTop: 4 },
  // summary metric boxes
  boxRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  box: { width: "33.33%", padding: 4 },
  boxInner: { backgroundColor: BOX, borderRadius: 5, padding: "8 9" },
  boxV: { fontSize: 15, fontFamily: "Helvetica-Bold" },
  boxL: { fontSize: 8, color: MUTED, marginTop: 2 },
  // tables
  tHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: INK, paddingBottom: 3, marginBottom: 2 },
  tRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 3 },
  th: { fontSize: 8, color: MUTED, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  td: { fontSize: 9.5 },
  rt: { textAlign: "right" },
  // yoy stat blocks
  yoyRow: { flexDirection: "row", marginHorizontal: -6, marginBottom: 14 },
  yoyCard: { flex: 1, marginHorizontal: 6, backgroundColor: BOX, borderRadius: 6, padding: 12 },
  yoyBig: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  yoyLbl: { fontSize: 9, color: MUTED, marginBottom: 4 },
  yoyDelta: { fontSize: 9, marginTop: 4 },
});

const footer = note => h(View, { key: "footer", style: s.footer, fixed: true }, [
  h(Text, { key: "a" }, "Source: SFAR MLS, geocoded. Medians use closed sales in the selected period. * small sample (n<50)."),
  h(Text, { key: "b", render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` }),
]);

function cover(data) {
  return h(Page, { key: "cover", size: "LETTER", style: s.page }, [
    h(View, { key: "c", style: { marginTop: 150 } }, [
      h(Text, { key: "k", style: s.kicker }, data.periodLabel.toUpperCase()),
      h(Text, { key: "t", style: s.h1 }, "San Francisco"),
      h(Text, { key: "t2", style: { fontSize: 22, color: MUTED, fontFamily: "Helvetica-Bold", letterSpacing: -0.3 } }, "Market Update"),
      h(View, { key: "ln", style: { height: 3, width: 70, backgroundColor: ACCENT, marginTop: 18 } }),
      data.filtersLine ? h(Text, { key: "f", style: { marginTop: 16, fontSize: 10, color: MUTED } }, "Filters: " + data.filtersLine) : null,
      h(Text, { key: "seg", style: { marginTop: 8, fontSize: 10, color: MUTED } }, "Segments: " + data.segments.map(x => x.name).join(" · ")),
    ]),
    footer(),
  ]);
}

function summaryBoxes(seg) {
  const m = seg.summary;
  const items = [
    ["Median sale price", usdShort(m.median)],
    ["Days on market", intf(m.dom)],
    ["$ / sq. ft.", usd(m.ppsf)],
    ["For sale (active)", intf(m.forSale)],
    ["Into contract", intf(m.intoContract)],
    ["Properties sold", intf(m.sold)],
  ];
  return h(View, { style: { marginBottom: 16 } }, [
    h(Text, { key: "n", style: s.segName }, seg.name),
    h(View, { key: "r", style: s.boxRow }, items.map((it, i) =>
      h(View, { key: i, style: s.box }, h(View, { style: s.boxInner }, [
        h(Text, { key: "v", style: s.boxV }, it[1]),
        h(Text, { key: "l", style: s.boxL }, it[0]),
      ]))
    )),
  ]);
}

function summaryPage(data) {
  return h(Page, { key: "sum", size: "LETTER", style: s.page }, [
    h(Text, { key: "h", style: s.h2 }, "Market summary"),
    h(Text, { key: "s", style: s.sub }, data.periodLabel),
    ...data.segments.map((seg, i) => h(View, { key: i }, summaryBoxes(seg))),
    footer(),
  ]);
}

function compareTable(seg, data) {
  return h(View, { key: "cmp", style: { marginBottom: 16 } }, [
    h(View, { key: "hd", style: s.tHead }, [
      h(Text, { key: 0, style: [s.th, { flex: 2 }] }, "Metric"),
      h(Text, { key: 1, style: [s.th, s.rt, { flex: 1 }] }, data.periodLabel),
      h(Text, { key: 2, style: [s.th, s.rt, { flex: 1 }] }, data.priorLabel),
      h(Text, { key: 3, style: [s.th, s.rt, { flex: 1 }] }, "Y/Y %"),
    ]),
    ...seg.compare.map((r, i) => h(View, { key: i, style: s.tRow }, [
      h(Text, { key: 0, style: [s.td, { flex: 2 }] }, r.label),
      h(Text, { key: 1, style: [s.td, s.rt, { flex: 1, fontFamily: "Helvetica-Bold" }] }, fmtVal(r.cur, r.fmt)),
      h(Text, { key: 2, style: [s.td, s.rt, { flex: 1, color: MUTED }] }, fmtVal(r.prior, r.fmt)),
      h(Text, { key: 3, style: [s.td, s.rt, { flex: 1, color: deltaColor(r.pct) }] }, fmtDelta(r.pct)),
    ])),
  ]);
}

function neighborhoodTable(seg) {
  if (!seg.neighborhoods.length) return null;
  return h(View, { key: "nb" }, [
    h(Text, { key: "t", style: [s.segName, { fontSize: 11, marginTop: 6 }] }, "Median values by neighborhood"),
    h(View, { key: "hd", style: s.tHead }, [
      h(Text, { key: 0, style: [s.th, { flex: 2.4 }] }, "Neighborhood"),
      h(Text, { key: 1, style: [s.th, s.rt, { flex: 1 }] }, "Median"),
      h(Text, { key: 2, style: [s.th, s.rt, { flex: 1 }] }, "$/SqFt"),
      h(Text, { key: 3, style: [s.th, s.rt, { flex: 1 }] }, "% of list"),
      h(Text, { key: 4, style: [s.th, s.rt, { flex: 0.8 }] }, "Sold"),
    ]),
    ...seg.neighborhoods.map((n, i) => h(View, { key: i, style: s.tRow, wrap: false }, [
      h(Text, { key: 0, style: [s.td, { flex: 2.4 }] }, n.name + (n.small ? " *" : "")),
      h(Text, { key: 1, style: [s.td, s.rt, { flex: 1 }] }, usdShort(n.median)),
      h(Text, { key: 2, style: [s.td, s.rt, { flex: 1 }] }, usd(n.ppsf)),
      h(Text, { key: 3, style: [s.td, s.rt, { flex: 1 }] }, n.pctList == null ? "—" : Math.round(n.pctList) + "%"),
      h(Text, { key: 4, style: [s.td, s.rt, { flex: 0.8 }] }, intf(n.sold)),
    ])),
  ]);
}

function segmentPage(seg, data, key) {
  return h(Page, { key, size: "LETTER", style: s.page, wrap: true }, [
    h(Text, { key: "h", style: s.h2 }, seg.name),
    h(Text, { key: "s", style: s.sub }, `${data.periodLabel}  ·  vs ${data.priorLabel}  ·  ${seg.typesCovered}`),
    compareTable(seg, data),
    neighborhoodTable(seg),
    footer(),
  ]);
}

function yoyPage(data) {
  const block = (seg, i) => h(View, { key: i, style: { marginBottom: 16 } }, [
    h(Text, { key: "n", style: s.segName }, seg.name),
    h(View, { key: "r", style: s.yoyRow }, [
      h(View, { key: 0, style: s.yoyCard }, [
        h(Text, { key: "l", style: s.yoyLbl }, "Median sale price"),
        h(Text, { key: "v", style: s.yoyBig }, usdShort(seg.yoy.medianPrice)),
        h(Text, { key: "d", style: [s.yoyDelta, { color: deltaColor(seg.yoy.medianPricePct) }] }, fmtDelta(seg.yoy.medianPricePct) + " Y/Y"),
      ]),
      h(View, { key: 1, style: s.yoyCard }, [
        h(Text, { key: "l", style: s.yoyLbl }, "Number of sales"),
        h(Text, { key: "v", style: s.yoyBig }, intf(seg.yoy.sales)),
        h(Text, { key: "d", style: [s.yoyDelta, { color: deltaColor(seg.yoy.salesPct) }] }, fmtDelta(seg.yoy.salesPct) + " Y/Y"),
      ]),
      h(View, { key: 2, style: s.yoyCard }, [
        h(Text, { key: "l", style: s.yoyLbl }, "Median days on market"),
        h(Text, { key: "v", style: s.yoyBig }, seg.yoy.dom == null ? "—" : seg.yoy.dom + " days"),
        h(Text, { key: "d", style: [s.yoyDelta, { color: deltaColor(seg.yoy.domDelta == null ? null : -seg.yoy.domDelta) }] }, seg.yoy.domDelta == null ? "n/a" : (seg.yoy.domDelta > 0 ? "+" : "") + seg.yoy.domDelta + " days Y/Y"),
      ]),
    ]),
  ]);
  return h(Page, { key: "yoy", size: "LETTER", style: s.page }, [
    h(Text, { key: "h", style: s.h2 }, "Year-over-year"),
    h(Text, { key: "s", style: s.sub }, `${data.periodLabel} vs ${data.priorLabel}`),
    ...data.segments.map((seg, i) => block(seg, i)),
    footer(),
  ]);
}

export function ReportDocument(data) {
  return h(Document, { title: data.title }, [
    cover(data),
    summaryPage(data),
    ...data.segments.map((seg, i) => segmentPage(seg, data, "seg" + i)),
    yoyPage(data),
  ]);
}
