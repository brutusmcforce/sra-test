export default {
  appTitle: "SRA Ampumakoe",
  shootingTestApp: "SRA-koe sovellus",
  language: {
    label: "Kieli",
    fi: "Suomi",
    sv: "Svenska",
    en: "English",
  },
  nav: {
    resultList: "Tuloslista",
    rangeSetup: "Kattaus",
    rules: "Säännöt",
    about: "Tietoja",
  },
  result: {
    failed: "HYLÄTTY",
    inProgress: "KESKEN",
    passed: "HYVÄKSYTTY",
  },
  resultList: {
    intro:
      "Tervetuloa SRA ampumakokeeseen. Syötä ampumakokeeseen ostallistuvien henkilöiden nimet alla. Sovellukseen kirjatut tiedot tallentuvat ainoastaan päätelaitteen muistiin. Tietoja ei tallenneta ja jaeta verkossa. Voit ladata PDF-muotoiset tulospöytäkirjat tuloksien kirjaamisen jälkeen.",
    shooters: "Ampujat",
    title: "Tuloslista",
    columnName: "Nimi",
    columnStages: "Rastit",
    columnResultAndHf: "Tulos ja HF",
    columnReport: "Pöytäkirja",
    columnRemove: "Poista",
    confirmRemoveShooter: "Poista ampujan {shooter} tulostiedot?",
    confirmReset:
      "Haluatko todella tyhjentää listan ja poistaa kaikki tulokset?",
    warnDuplicateShooter: "Ampuja nimellä {name} on jo listalla.",
    warnDuplicateFirstName:
      "Ampuja etunimellä {name} on jo listalla. Lisää sukunimi.",
    addShooter: "Lisää ampuja",
    namePlaceholder: "Ampujan nimi",
    add: "Lisää",
    shootingOrder: "Kokeen ampumajärjestys",
    rotatingOrder:
      "Kiertävä järjestys: ensimmäisenä ampunut siirtyy seuraavalla rastilla viimeiseksi",
    fixedOrder: "Sama järjestys joka rastilla",
    testEvent: "Koetilaisuus »",
    placeAndTime: "Paikka ja aika",
    placePlaceholder: "Paikka",
    receivingReferee: "Vastaanottava tuomari",
    namePlaceholderReferee: "Nimi",
    sraIdPlaceholder: "SRA ID",
    phonePlaceholder: "Puhelin",
    removeAll: "Poista kaikki ampujat",
    randomize: "⤭ Järjestä satunnaisesti",
    editInfo: "Muokkaa tietoja",
    continue: "Jatka",
    startTest: "Aloita ampumakoe",
    removeBtn: "🗑 POISTA",
  },
  shooter: {
    pdfHint:
      "Koetuloksen PDF-pöytäkrijalle tulostettavat (valinnaiset) lisätiedot.",
    birthDate: "Syntymäaika",
    courseNumber: "SRA kurssin numero tai muu tunniste",
    club: "RU/RES/MPKL yhdistys",
    disqualificationReason: "Hylkäyksen syy:",
    scoreCardLink: "Tuloskortti »",
    recordDq: "Kirjaa hylkäys",
    cancelDq: "Peru hylkäys",
    pdfReport: "PDF-pöytäkirja",
    dqPrompt: "Ampujan {shooter} hylkäämisen syy?",
    autoDqReason: "Osumakerroin alle {factor}.",
  },
  scoring: {
    shootingNextWithLast:
      "Ammutaan. Seuraava ampuja {shooter}, tämän rastin viimeinen ampuja.",
    shootingNextFinal:
      "Ammutaan. Seuraava ampuja {shooter}, ampumakokeen viimeinen suoritus.",
    shootingNextWithUpcoming:
      "Ammutaan. Seuraava ampuja {shooter}, {next} valmistautuu.",
    stage: "Rasti",
    stageHeader: "Rasti {stage} / {shooter}",
    method: "Suoritustapa:",
    pistol: "Pistooli",
    rifle: "Kivääri",
    recordDq: "Kirjaa hylkäys",
    cancelDq: "Peru hylkäys",
    stageDescription: "Rastikuvaus",
    close: "Sulje",
    hits: "Osumat",
    points: "Pisteet",
    hitClassMiss: "Ohi",
    hitClassPenalty: "Rang",
    previousShooter: "Edellinen ampuja",
    nextShooter: "Seuraava ampuja",
    confirmIncomplete:
      "Ampumasuorituksen kirjaaminen ei ole valmis. Haluatko jättää tuloksen kirjaamisen kesken?",
  },
  stages: {
    description: [
      "10 m. Lähtöasento seisten kohti tauluja, ohjeaika 5 s/sarja. 1. ja 2. sarjassa pistooli kotelossa, 3. sarjassa pistooli pöydällä (jos ei pöytää, kädessä) ladattuna. 1. SARJA: 2 lks. per taulu, molemmin käsin. 2. SARJA: 2 lks. per taulu vahvemmalla kädellä. 3. SARJA: 2 lks. per taulu heikommalla kädellä",
      "10 m. Lähtöasento pistooli ladattuna kotelossa, 1. sarjassa selkä kohti tauluja, 2. sarjassa vasen kylki kohti tauluja ja 3. sarjassa oikea kylki kohti tauluja, ohjeaika 5s/sarja. 1. SARJA: käännös 180° ja 2 lks. per taulu. 2. SARJA: käännös 90° ja 2 lks. per taulu. 3. SARJA: käännös 90° ja 2 lks. per taulu'",
      "10 m. Lähtöasento selin kädet ylhäällä pistooli ladattuna kotelossa, ohjeaika 15 sekuntia, ampuja saa valita aloittaako paikasta A vai B. Suoritus: käännös 180° ja 2 lks. edessä olevaan tauluun paikasta A tai B, siirtyminen toiseen paikkaan, siirtymisen aikana lippaanvaihto. Toisesta paikasta B/A 2 lks. edessä olevaan tauluun ja siirtyminen lähtöpaikkaan, siirtymisen aikana lippaanvaihto. Lähtöpaikasta 2 lks. edessä olevaan tauluun.",
      "20–15–10 m, ohjeaika 25 sekuntia. Lähtö seisten kohti tauluja pistooli ladattuna kotelossa. Suoritus: 2 lks. per taulu paikasta A (20 m) seisaaltaan, siirtyminen, jonka aikana lippaan vaihto, paikkaan B (15 m), josta 2 lks. per taulu polvelta, siirtyminen jonka aikana lippaan vaihto paikkaan C (10 m) josta 2 lks. per taulu makuulta. Jos koeradalla makuulta ampuminen ei onnistu, niin asento paikassa C on myös polvelta.",
      "Valinnainen kivääri piippu 45 asteen kulmassa alaspäin tai pistooli ladattuna kotelossa. Ohjeaika 15 sekuntia. Kivääri: 20 m, lähtö seisten kohti tauluja. Ampuja valitsee aloittaako paikasta A vai B. Lähtöpaikasta 2 lks. kumpaankin tauluun, siirtyminen paikkaan B/A, josta 2 lks. kumpaankin tauluun, siirtyminen paikkaan C, josta 2 lks. kumpaankin tauluun. Pistooli: 10–15 m, lähtö 10 m paikalta seisten kohti tauluja. 10 metristä 2 lks. kumpaankin tauluun, siirtyminen 15 metriin, josta 2 lks. kumpaankin tauluun.",
    ],
  },
  scoreCard: {
    invalidLink:
      "Linkin tulostietojen käsittely ei onnistunut. Onko linkki kopioitu oikein?",
    title: "SRA Ampumakoe",
    scoreCard: "Tuloskortti",
    columnStage: "Rasti",
    columnHits: "Osumat",
    columnPoints: "Pisteet",
    columnTime: "Aika",
    columnHfTooltip: "Osumakerroin: pisteet jaettuna ajalla (sekunnit).",
    total: "Yht.",
    resultLabel: "Tulos",
    dqReasonLabel: "Hylkäyksen syy",
    sraReferee: "SRA-tuomari",
    share: "Jaa",
    copyLink: "Kopioi linkki",
    notStored:
      "Tulostietoja ei tallenneta palvelimelle. Tällä sivulla esitetyt tulostiedot on sisällytetty QR-koodin linkin tietoihin.",
    parseFailed:
      "Tulostietojen tulkitseminen epäonnistui - onko linkki kopioitu virheellisesti?",
    copyPrompt: "Kopioi tämä linkki:",
    shareText: "SRA-ampumakokeen tuloskortti",
    documentTitle: "SRA-ampumakokeen tuloskortti",
  },
  safety: {
    heading: "Turvallisuus",
    intro:
      "Kaikessa aseen käytössä on noudatettava seuraavia turvallisen aseenkäsittelyn sääntöjä:",
    rule1Bold: "Asetta on aina käsiteltävä kuin se olisi ladattu",
    rule1Body:
      "Ei ole merkitystä, onko ase ladattu tai onko ase toimimaton käsittelyase, käsittelyn on aina oltava samanlaista.",
    rule2Prefix: "Piippukontrolli, ",
    rule2Bold: "aseen piipun on aina osoitettava turvalliseen suuntaan",
    rule2Body:
      '"Laser-sääntö", aseella ei saa koskaan osoittaa mitään sellaista, jota ei halua tuhota.',
    rule3Prefix: "Sormivarmistus, ",
    rule3Bold: "sormi pidetään pois liipaisimelta ennen ampumapäätöstä",
    rule3Body:
      "Liipaisinsormi on pidettävä tietoisesti aseen rungolla. Sormi laitetaan liipaisimelle vasta, kun on tehty tietoinen ampumapäätös.",
    rule4Bold: "Tunnista maali ja varmista tausta",
    rule4Body:
      "Maali on aina tunnistettava ennen kuin sitä ammutaan. Maalin takana ei saa olla omia taistelijoita tai sivullisia.",
    acknowledgment:
      "Kaikki ampumakokeen osallistujat tuntevat yllä olevat turvalliset aseen käsittelyn säännöt.",
    continue: "Jatka",
  },
  about: {
    heading: "Tietoja",
    appVersion: "Sovelluksen versio {version}",
    description:
      "Tämä on Sovelletun reserviläisammunan (SRA) käytännön ampumakokeen pisteystystyökalu, jota voidaan käyttää ampumakoetilaisuuksissa pisteenlaskun apuna. Sovellettu reserviläisammunta on Reserviläisurheiluliiton hallinnoima toiminnallinen ampumalaji. Tämä sovellus ei ole Reserviläisurheiluliiton hyväksymä tai virallinen työkalu, mutta voi olla hyödyllinen koetilaisuuksien toteuttamisessa ja PDF-muotoisten koepöytäkirjojen tuottamisessa.",
    privacyHeading: "Yksityisyys",
    privacyBody:
      "Pistelaskurin tallentamat tiedot ovat: ampujan nimi ja ampumasuorituksien aika- ja pistelukemat. Tiedot tallentuvat ainoastaan päätelaitteen (selainohjelman) muistiin. Tietoja ei tallenneta verkkopalvelimille tai pilvipalveluihin.",
    linksHeading: "Linkkejä",
    feedbackHeading: "Palaute ja kehitys",
    feedbackBody:
      "Jos huomaat sovelluksessa puutteita tai toivoisit parannuksia, ole yhteydessä suoraan kehittäjään Magnus von Wachenfeldt ",
    githubLink: "Projekti Githubissa",
    changelogHeading: "Versiohistoria",
    creditsHeading: "Kiitokset",
    creditsBody:
      "Tämä sovellus perustuu Matti Pöllän alkuperäiseen työhön. Alkuperäisen sovelluksen lähdekoodi löytyy osoitteesta ",
  },
};
