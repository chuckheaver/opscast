// Browser-side: render the report to a PDF blob and download it. This module
// (and @react-pdf/renderer) is only pulled in via a dynamic import when the
// user taps "Download report", so it never weighs down the main bundle.

import { pdf } from "@react-pdf/renderer";
import { ReportDocument } from "./reportDoc";

export async function downloadReport(data, filename = "SF_Market_Update.pdf") {
  const blob = await pdf(ReportDocument(data)).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
