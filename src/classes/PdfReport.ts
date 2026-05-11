import type { ScoresStore } from "@/stores/scores";
import { i18n } from "@/i18n";
import { PdfReportFi } from "@/classes/PdfReport.fi";
import { PdfReportSv } from "@/classes/PdfReport.sv";

export class PdfReport {
  async createPdf(shooter: string, scoresStore: ScoresStore, path = "") {
    const locale =
      typeof i18n.global.locale === "object" && "value" in i18n.global.locale
        ? i18n.global.locale.value
        : i18n.global.locale;

    const report = locale === "fi" ? new PdfReportFi() : new PdfReportSv();
    return report.createPdf(shooter, scoresStore, path);
  }
}
