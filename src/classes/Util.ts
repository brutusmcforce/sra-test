import pako from 'pako'

export const recordDisqualification = (scoresStore: any, shooter: string) => {
    const reason = window.prompt("Ampujan " + shooter + " hylkäämisen syy?", "") as string
    if (reason != null && reason !== "") {
        scoresStore.recordDisqualification(shooter, reason)
    }
}

export const cancelDisqualification = (scoresStore: any, shooter: string) => {
    scoresStore.cancelDisqualification(shooter)
}

export const shareLink = (data: CardData): string => {
    return "./result?d=" + encodeData(data)
}

/**
 * Encodes a single shooter's result as a JSON object, which is passed (compressed and base64-encoded)
 * to the score card.
 */
export const shareData = (shooter: string, scoresStore: any): CardData => {
    return {
        "n": shooter,
        "dl": scoresStore.getDateAndPlace(),
        "r": [
            scoresStore.getShooterStageClassHits(shooter, 0),
            scoresStore.getShooterStageClassHits(shooter, 1),
            scoresStore.getShooterStageClassHits(shooter, 2),
            scoresStore.getShooterStageClassHits(shooter, 3),
            scoresStore.getShooterStageClassHits(shooter, 4)
        ],
        "a": [
            scoresStore.getShooterStageTime(shooter, 0),
            scoresStore.getShooterStageTime(shooter, 1),
            scoresStore.getShooterStageTime(shooter, 2),
            scoresStore.getShooterStageTime(shooter, 3),
            scoresStore.getShooterStageTime(shooter, 4)
        ],
        "h": scoresStore.getDisqualificationReason(shooter),
        "tn": scoresStore.getRefereeName(),
        "tno": scoresStore.getRefereeNumber()
    } as CardData
}

export function encodeData(cardData: CardData): string {
    const json = JSON.stringify(cardData)
    const compressed = pako.deflate(json)
    const base64 = window.btoa(
        String.fromCharCode(...compressed)
    )
    // URL-safe base64
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}
