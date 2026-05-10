import * as pako from "pako";
import type { ScoresStore } from "@/stores/scores";

export const recordDisqualification = (
  scoresStore: ScoresStore,
  shooter: string,
  promptMessage: string,
) => {
  const reason = window.prompt(promptMessage, "");
  if (reason != null && reason !== "") {
    scoresStore.recordDisqualification(shooter, reason);
  }
};

export const cancelDisqualification = (
  scoresStore: ScoresStore,
  shooter: string,
) => {
  scoresStore.cancelDisqualification(shooter);
};

export const shareLink = (data: CardData): string =>
  "./result?d=" + encodeData(data);

export const shareData = (
  shooter: string,
  scoresStore: ScoresStore,
): CardData =>
  ({
    n: shooter,
    dl: scoresStore.getDateAndPlace(),
    r: [0, 1, 2, 3, 4].map((stage) =>
      scoresStore.getShooterStageClassHits(shooter, stage),
    ),
    a: [0, 1, 2, 3, 4].map((stage) =>
      scoresStore.getShooterStageTime(shooter, stage),
    ),
    h: scoresStore.getDisqualificationReason(shooter),
    tn: scoresStore.getRefereeName(),
    tno: scoresStore.getRefereeNumber(),
  }) as CardData;

export function encodeData(cardData: CardData): string {
  const json = JSON.stringify(cardData);
  const compressed = pako.deflate(json);
  const base64 = window.btoa(String.fromCharCode(...compressed));

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
