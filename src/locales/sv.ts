export default {
  appTitle: "SRA Skjuttest",
  shootingTestApp: "SRA-test-applikation",
  language: {
    label: "Språk",
    fi: "Suomi",
    sv: "Svenska",
    en: "English",
  },
  nav: {
    resultList: "Resultatlista",
    rules: "Regler",
    about: "Om",
  },
  result: {
    failed: "UNDERKÄND",
    inProgress: "PÅGÅR",
    passed: "GODKÄND",
  },
  resultList: {
    intro:
      "Välkommen till SRA-skjuttestet. Skriv in deltagarnas namn nedan. Information som matas in i applikationen sparas endast i den lokala enhetens minne. Inga uppgifter lagras eller delas via nätet. Du kan ladda ner PDF-protokoll efter att resultaten har registrerats.",
    shooters: "Skyttar",
    title: "Resultatlista",
    columnName: "Namn",
    columnStages: "Stationer",
    columnResultAndHf: "Resultat och HF",
    columnReport: "Protokoll",
    columnRemove: "Ta bort",
    confirmRemoveShooter: "Ta bort resultatdata för {shooter}?",
    confirmReset: "Vill du verkligen tömma listan och ta bort alla resultat?",
    warnDuplicateShooter: "En skytt med namnet {name} finns redan på listan.",
    warnDuplicateFirstName:
      "En skytt med förnamnet {name} finns redan på listan. Lägg till efternamn.",
    addShooter: "Lägg till skytt",
    namePlaceholder: "Skyttens namn",
    add: "Lägg till",
    shootingOrder: "Skjutordning",
    rotatingOrder:
      "Roterande ordning: den som sköt först på en station flyttas sist på nästa station",
    fixedOrder: "Samma ordning på varje station",
    testEvent: "Testtillfälle »",
    placeAndTime: "Plats och tid",
    placePlaceholder: "Plats",
    receivingReferee: "Mottagande domare",
    namePlaceholderReferee: "Namn",
    sraIdPlaceholder: "SRA-ID",
    phonePlaceholder: "Telefon",
    removeAll: "Ta bort alla skyttar",
    randomize: "⤭ Slumpa ordning",
    editInfo: "Redigera uppgifter",
    continue: "Fortsätt",
    startTest: "Starta skjuttestet",
    removeBtn: "🗑 TA BORT",
  },
  shooter: {
    pdfHint: "Valfria tilläggsuppgifter som skrivs ut i PDF-protokollet.",
    birthDate: "Födelsedatum",
    courseNumber: "SRA-kursnummer eller annan identifierare",
    club: "RU/RES/MPKL-förening",
    disqualificationReason: "Orsak till underkännande:",
    scoreCardLink: "Resultatkort »",
    recordDq: "Registrera underkännande",
    cancelDq: "Ångra underkännande",
    pdfReport: "PDF-protokoll",
    dqPrompt: "Orsak till att underkänna {shooter}?",
    autoDqReason: "Träfffaktor under {factor}.",
  },
  scoring: {
    shootingNextWithLast:
      "Skjuts. Nästa skytt {shooter}, sista skytten på denna station.",
    shootingNextFinal:
      "Skjuts. Nästa skytt {shooter}, sista skjutomgången i testet.",
    shootingNextWithUpcoming:
      "Skjuts. Nästa skytt {shooter}, {next} förbereder sig.",
    stage: "Station",
    stageHeader: "Station {stage} / {shooter}",
    method: "Vapen:",
    pistol: "Pistol",
    rifle: "Gevär",
    recordDq: "Registrera underkännande",
    cancelDq: "Ångra underkännande",
    stageDescription: "Stationsbeskrivning",
    close: "Stäng",
    hits: "Träffar",
    points: "Poäng",
    previousShooter: "Föregående skytt",
    nextShooter: "Nästa skytt",
    confirmIncomplete:
      "Resultatregistreringen är inte färdig. Vill du lämna den oavslutad?",
  },
  stages: {
    description: [
      "10 m. Utgångsläge stående mot målen, riktid 5 s/serie. I serie 1 och 2 är pistolen i hölster, i serie 3 ligger den laddad på bordet (eller i handen om bord saknas). SERIE 1: 2 skott per mål, tvåhänt. SERIE 2: 2 skott per mål med starkare handen. SERIE 3: 2 skott per mål med svagare handen.",
      "10 m. Utgångsläge: pistol laddad i hölster; serie 1 rygg mot målen, serie 2 vänster sida mot målen, serie 3 höger sida mot målen. Riktid 5 s/serie. SERIE 1: vändning 180° och 2 skott per mål. SERIE 2: vändning 90° och 2 skott per mål. SERIE 3: vändning 90° och 2 skott per mål.",
      "10 m. Utgångsläge ryggen mot målen, händer upp, pistol laddad i hölster. Riktid 15 sekunder; skytten får välja om hen börjar från position A eller B. Utförande: vändning 180° och 2 skott i målet framför från position A eller B, förflyttning till andra positionen med magasinsbyte. Från position B/A 2 skott i målet framför, sedan förflyttning tillbaka till utgångsläget med magasinsbyte. Från utgångsläget 2 skott i målet framför.",
      "20–15–10 m, riktid 25 sekunder. Start stående mot målen, pistol laddad i hölster. Utförande: 2 skott per mål från position A (20 m) stående; förflyttning med magasinsbyte till position B (15 m); 2 skott per mål från knästående; förflyttning med magasinsbyte till position C (10 m); 2 skott per mål liggande. Om liggande inte är möjligt på banan utförs även position C från knästående.",
      "Valfritt gevär med pipan riktad 45° nedåt eller pistol laddad i hölster. Riktid 15 sekunder. Gevär: 20 m, start stående mot målen. Skytten väljer om hen börjar från position A eller B. Från utgångspositionen 2 skott i vartdera målet, förflyttning till position B/A, 2 skott i vartdera målet, förflyttning till position C, 2 skott i vartdera målet. Pistol: 10–15 m, start stående på 10 m mot målen. Från 10 m 2 skott i vartdera målet, förflyttning till 15 m, 2 skott i vartdera målet.",
    ],
  },
  scoreCard: {
    invalidLink:
      "Resultatdata i länken kunde inte tolkas. Är länken kopierad rätt?",
    title: "SRA Skjuttest",
    scoreCard: "Resultatkort",
    columnStage: "Station",
    columnHits: "Träffar",
    columnPoints: "Poäng",
    columnTime: "Tid",
    columnHfTooltip: "Träfffaktor: poäng dividerat med tid (sekunder).",
    total: "Tot.",
    resultLabel: "Resultat",
    dqReasonLabel: "Orsak till underkännande",
    sraReferee: "SRA-domare",
    share: "Dela",
    copyLink: "Kopiera länk",
    notStored:
      "Resultatdata sparas inte på någon server. Uppgifterna på denna sida är inkluderade i QR-kodens länk.",
    parseFailed:
      "Det gick inte att tolka resultatdata — kopierades länken felaktigt?",
    copyPrompt: "Kopiera den här länken:",
    shareText: "SRA-skjuttestets resultatkort",
    documentTitle: "SRA-skjuttestets resultatkort",
  },
  safety: {
    heading: "Säkerhet",
    intro: "Följande regler för säker vapenhantering ska alltid följas:",
    rule1Bold: "Hantera alltid vapnet som om det vore laddat",
    rule1Body:
      "Det spelar ingen roll om vapnet är laddat eller är ett dummyvapen — hanteringen ska alltid vara likadan.",
    rule2Prefix: "Pipkontroll, ",
    rule2Bold: "vapnets pipa ska alltid peka i en säker riktning",
    rule2Body:
      '"Laserregeln": vapnet får aldrig riktas mot något man inte är villig att förstöra.',
    rule3Prefix: "Avtryckardisciplin, ",
    rule3Bold:
      "fingret hålls bort från avtryckaren tills beslutet att skjuta är fattat",
    rule3Body:
      "Avtryckarfingret hålls medvetet på vapnets stomme. Fingret läggs på avtryckaren först när ett medvetet skjutbeslut har fattats.",
    rule4Bold: "Identifiera målet och kontrollera bakgrunden",
    rule4Body:
      "Målet måste alltid identifieras innan skott avlossas. Det får inte finnas egna soldater eller åskådare bakom målet.",
    acknowledgment:
      "Alla deltagare känner till ovanstående regler för säker vapenhantering.",
    continue: "Fortsätt",
  },
  about: {
    heading: "Om",
    appVersion: "Applikationens version {version}",
    description:
      "Detta är ett poängräkningsverktyg för det praktiska skjutprovet inom Tillämpad reservistskytte (SRA). Det kan användas som hjälp vid poängräkning på skjutprovstillfällen. SRA (Sovellettu reserviläisammunta) är en praktisk skjutgren som administreras av Reservistsportförbundet. Den här applikationen är inte godkänd eller officiell, men kan vara till nytta vid genomförandet av provtillfällen och vid framställning av PDF-protokoll.",
    privacyHeading: "Integritet",
    privacyBody:
      "Poängräknaren sparar: skyttens namn samt tider och poäng från skjutomgångarna. Uppgifterna sparas endast i den lokala enhetens (webbläsarens) minne. Inget sparas på servrar eller molntjänster.",
    linksHeading: "Länkar",
    feedbackHeading: "Feedback och utveckling",
    feedbackBody:
      "Om du hittar brister eller har förslag, kontakta utvecklaren Matti Pöllä direkt på ",
    githubLink: "Projektet på GitHub",
    changelogHeading: "Versionshistorik",
  },
};
