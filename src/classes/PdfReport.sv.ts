import { PDFDocument, rgb } from "pdf-lib";
import { SraShootingTest } from "@/classes/SraShootingTest";
import type { ScoresStore } from "@/stores/scores";

function downloadBytes(bytes: Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([bytes as BlobPart], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export class PdfReportSv {
  formatNumber = (value: number): string => {
    if (value == 0) {
      return "";
    } else {
      return value.toString();
    }
  };

  formatTime = (value: number): string => {
    if (value == 0 || value == undefined) {
      return "";
    } else {
      return value.toFixed(2);
    }
  };

  formatHitFactorPdf = (hitFactor: number) => {
    if (hitFactor == null || isNaN(hitFactor)) {
      return "";
    } else {
      return hitFactor.toFixed(2);
    }
  };

  pdfRefereeInfo(scoresStore: ScoresStore) {
    let refereeInfo = "";

    refereeInfo += scoresStore.referee_name;

    return refereeInfo;
  }

  async createPdf(shooter: string, scoresStore: ScoresStore, path = "") {
    const STAGE_Y_OFFSET = [699, 597, 496, 394, 291];

    const ROW_H = 12;

    const T1_X = 393;
    const T2_X = 427;
    const HITS_X = 465;
    const POINTS_X = 505;
    const TIME_X = 538;

    const fontBytes = await fetch(path + "sra-test-sv.pdf").then((res) =>
      res.arrayBuffer(),
    );

    const pdfDoc = await PDFDocument.load(fontBytes);
    const pages = pdfDoc.getPages();

    pages[0].setFontColor(rgb(0.1, 0.1, 0.97));

    pages[0].drawText(shooter, { x: 62, y: 721, size: 10 });

    // Förening
    if (scoresStore.clubs[shooter] !== undefined) {
      pages[0].drawText(scoresStore.clubs[shooter], {
        x: 70,
        y: 707,
        size: 10,
      });
    }

    // Pistolskyttekortsnr
    if (scoresStore.courseNumbers[shooter] !== undefined) {
      pages[0].drawText(scoresStore.courseNumbers[shooter], {
        x: 104,
        y: 692,
        size: 10,
      });
    }

    // Division (Militär / Öppen / Standard)
    const CLASS_CHECKBOX_XY: Record<string, { x: number; y: number }> = {
      Militär: { x: 77, y: 668 },
      Öppen: { x: 129, y: 668 },
      Standard: { x: 180, y: 668 },
    };

    const classBox = CLASS_CHECKBOX_XY[scoresStore.shooterClasses[shooter]];

    if (classBox) {
      pages[0].drawText("X", { x: classBox.x, y: classBox.y, size: 18 });
    }

    for (const stage in SraShootingTest.stages) {
      for (const row in [0, 1, 2, 3, 4, 5]) {
        // Target 1
        pages[0].drawText(
          this.formatNumber(scoresStore.scores[shooter][stage][row][0]),
          { x: T1_X, y: STAGE_Y_OFFSET[stage] - Number(row) * ROW_H, size: 10 },
        );
        // Target 2
        pages[0].drawText(
          this.formatNumber(scoresStore.scores[shooter][stage][row][1]),
          { x: T2_X, y: STAGE_Y_OFFSET[stage] - Number(row) * ROW_H, size: 10 },
        );
        // Hits
        pages[0].drawText(
          this.formatNumber(
            scoresStore.getShooterStageClassHits(shooter, Number(stage))[row],
          ),
          {
            x: HITS_X,
            y: STAGE_Y_OFFSET[stage] - Number(row) * ROW_H,
            size: 10,
          },
        );
        // Points
        pages[0].drawText(
          this.formatNumber(
            scoresStore.getShooterStagePoints(shooter, Number(stage))[row],
          ),
          {
            x: POINTS_X,
            y: STAGE_Y_OFFSET[stage] - Number(row) * ROW_H,
            size: 10,
          },
        );
        // Time
        if (Number(row) < 3) {
          pages[0].drawText(
            this.formatTime(
              scoresStore.getShooterStageTimes(shooter, Number(stage))[row],
            ),
            {
              x: TIME_X,
              y: STAGE_Y_OFFSET[stage] - Number(row) * ROW_H,
              size: 10,
            },
          );
        }
      }

      if (scoresStore.disqualifications[shooter] !== undefined) {
        pages[0].drawText(scoresStore.disqualifications[shooter], {
          x: 36,
          y: 70,
          size: 10,
        });
      }

      // Total points and time
      pages[0].drawText(
        this.formatNumber(
          scoresStore.getShooterStagePointSum(shooter, Number(stage)),
        ),
        { x: POINTS_X, y: STAGE_Y_OFFSET[stage] - 5 * ROW_H, size: 10 },
      );

      pages[0].drawText(
        this.formatTime(
          scoresStore.getShooterStageTime(shooter as string, Number(stage)),
        ),
        { x: TIME_X, y: STAGE_Y_OFFSET[stage] - 5 * ROW_H, size: 10 },
      );
    }

    // Time sum, point sum, hit factor
    pages[0].drawText(
      this.formatNumber(scoresStore.getShooterPointSum(shooter)),
      { x: 552, y: 199, size: 10 },
    );

    pages[0].drawText(this.formatTime(scoresStore.getShooterTimeSum(shooter)), {
      x: 552,
      y: 183,
      size: 10,
    });

    pages[0].drawText(
      this.formatHitFactorPdf(
        scoresStore.getShooterHitFactor(shooter as string),
      ),
      { x: 552, y: 171, size: 10 },
    );

    // X Passed
    const hf = scoresStore.getShooterHitFactor(shooter as string);
    if (
      scoresStore.disqualifications[shooter] == undefined &&
      scoresStore.getAllShot(shooter) &&
      hf >= SraShootingTest.requiredHitFactor
    ) {
      pages[0].drawText("X", { x: 369, y: 124, size: 18 });
    }

    // X Failed
    if (
      scoresStore.disqualifications[shooter] !== undefined ||
      (scoresStore.getAllShot(shooter) &&
        hf < SraShootingTest.requiredHitFactor)
    ) {
      pages[0].drawText("X", { x: 399, y: 124, size: 18 });
    }

    // Place and date
    if (scoresStore.testEvent_place != "") {
      pages[0].drawText(scoresStore.testEvent_place, {
        x: 329,
        y: 90,
        size: 10,
      });
    }

    if (scoresStore.testEvent_date != "") {
      pages[0].drawText(scoresStore.testEvent_date, {
        x: 447,
        y: 90,
        size: 10,
      });
    }

    // Receiving referee info
    pages[0].drawText(this.pdfRefereeInfo(scoresStore), {
      x: 329,
      y: 59,
      size: 10,
    });

    const pdfBytes = await pdfDoc.save();
    const date = new Date().toISOString().substring(0, 10);
    const safeName = shooter.replace(/\s+/g, "-");
    downloadBytes(
      pdfBytes,
      `sra-test-${date}-${safeName}.pdf`,
      "application/pdf",
    );
  }
}
