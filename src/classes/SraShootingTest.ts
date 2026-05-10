export class SraShootingTest {
    static shotCountsWithPistol = [
        // Stage 1: With two hands and one hand
        [6, 6],
        // Stage 2: Turns
        [6, 6],
        // Stage 3: Move to the side and magazine change
        [4, 2],
        // Stage 4: Move forward and magazine change
        [6, 6],
        // Stage 5: Move backward (pistol variant)
        [4, 4]]

    static shotCountsWithRifle = [
        // Stage 1: With two hands and one hand
        [6, 6],
        // Stage 2: Turns
        [6, 6],
        // Stage 3: Move to the side and magazine change
        [4, 2],
        // Stage 4: Move forward and magazine change
        [6, 6],
        // Stage 5: Move backward (rifle variant)
        [6, 6]]

    static hitClasses = ['A', 'C', 'D', 'Ohi', 'Rang']

    static stages = [0, 1, 2, 3, 4]

    static requiredHitFactor = 1.3

    static hitScoring = { 'A': 5, 'C': 3, 'D': 1, 'Ohi': -10, 'Rang': -10 }

    static stageDescription = (stage: number): string => {
        switch (stage) {
            case 0: return "10 m. Lähtöasento seisten kohti tauluja, ohjeaika 5 s/sarja. 1. ja 2. sarjassa pistooli kotelossa, 3. sarjassa pistooli pöydällä (jos ei pöytää, kädessä) ladattuna. 1. SARJA: 2 lks. per taulu, molemmin käsin. 2. SARJA: 2 lks. per taulu vahvemmalla kädellä. 3. SARJA: 2 lks. per taulu heikommalla kädellä"
            case 1: return "10 m. Lähtöasento pistooli ladattuna kotelossa, 1. sarjassa selkä kohti tauluja, 2. sarjassa vasen kylki kohti tauluja ja 3. sarjassa oikea kylki kohti tauluja, ohjeaika 5s/sarja. 1. SARJA: käännös 180° ja 2 lks. per taulu. 2. SARJA: käännös 90° ja 2 lks. per taulu. 3. SARJA: käännös 90° ja 2 lks. per taulu'"
            case 2: return "10 m. Lähtöasento selin kädet ylhäällä pistooli ladattuna kotelossa, ohjeaika 15 sekuntia, ampuja saa valita aloittaako paikasta A vai B. Suoritus: käännös 180° ja 2 lks. edessä olevaan tauluun paikasta A tai B, siirtyminen toiseen paikkaan, siirtymisen aikana lippaanvaihto. Toisesta paikasta B/A 2 lks. edessä olevaan tauluun ja siirtyminen lähtöpaikkaan, siirtymisen aikana lippaanvaihto. Lähtöpaikasta 2 lks. edessä olevaan tauluun."
            case 3: return "20–15–10 m, ohjeaika 25 sekuntia. Lähtö seisten kohti tauluja pistooli ladattuna kotelossa. Suoritus: 2 lks. per taulu paikasta A (20 m) seisaaltaan, siirtyminen, jonka aikana lippaan vaihto, paikkaan B (15 m), josta 2 lks. per taulu polvelta, siirtyminen jonka aikana lippaan vaihto paikkaan C (10 m) josta 2 lks. per taulu makuulta. Jos koeradalla makuulta ampuminen ei onnistu, niin asento paikassa C on myös polvelta."
            case 4: return "Valinnainen kivääri piippu 45 asteen kulmassa alaspäin tai pistooli ladattuna kotelossa. Ohjeaika 15 sekuntia. Kivääri: 20 m, lähtö seisten kohti tauluja. Ampuja valitsee aloittaako paikasta A vai B. Lähtöpaikasta 2 lks. kumpaankin tauluun, siirtyminen paikkaan B/A, josta 2 lks. kumpaankin tauluun, siirtyminen paikkaan C, josta 2 lks. kumpaankin tauluun. Pistooli: 10–15 m, lähtö 10 m paikalta seisten kohti tauluja. 10 metristä 2 lks. kumpaankin tauluun, siirtyminen 15 metriin, josta 2 lks. kumpaankin tauluun."
        }
        return ''
    }

    static hitClassPronunciation = (hitClass: string): string => {
        switch(hitClass) {
            case 'A':
                return 'alpha'
            case 'C':
                return 'charlie'
            case 'D':
                return 'delta'
            case 'Ohi':
                return 'mike'
            case 'Rang':
                return 'procedural'
        }
        return ''
    }


}

export enum StageStatus {
    NotStarted,
    InProgress,
    Completed
}

export enum TestStatus {
    NotStarted,
    InProgress,
    Failed,
    Passed
}
