export default {
  appTitle: "SRA Shooting Test",
  shootingTestApp: "SRA Shooting Test app",
  language: {
    label: "Language",
    fi: "Suomi",
    sv: "Svenska",
    en: "English",
  },
  nav: {
    resultList: "Test",
    rules: "Rules",
    about: "About",
  },
  result: {
    failed: "FAILED",
    inProgress: "IN PROGRESS",
    passed: "PASSED",
  },
  resultList: {
    intro:
      "Welcome to the SRA shooting test. Enter the names of the participants below. Data entered in the app is stored only in this device's memory. No data is uploaded or shared online. After scoring, you can download PDF result reports.",
    shooters: "Shooters",
    title: "Results",
    columnName: "Name",
    columnStages: "Stages",
    columnResultAndHf: "Result and HF",
    columnReport: "Report",
    columnRemove: "Remove",
    confirmRemoveShooter: "Remove result data for {shooter}?",
    confirmReset:
      "Do you really want to clear the list and remove all results?",
    warnDuplicateShooter: "A shooter named {name} is already on the list.",
    warnDuplicateFirstName:
      "A shooter with first name {name} is already on the list. Please add a last name.",
    addShooter: "Add shooter",
    namePlaceholder: "Shooter name",
    add: "Add",
    shootingOrder: "Shooting order",
    rotatingOrder:
      "Rotating order: the first shooter on each stage moves to last on the next stage",
    fixedOrder: "Same order on every stage",
    testEvent: "Test event »",
    placeAndTime: "Place and time",
    placePlaceholder: "Place",
    receivingReferee: "Receiving referee",
    namePlaceholderReferee: "Name",
    sraIdPlaceholder: "SRA ID",
    phonePlaceholder: "Phone",
    removeAll: "Remove all shooters",
    randomize: "⤭ Randomize order",
    editInfo: "Edit info",
    continue: "Continue",
    startTest: "Start shooting test",
    removeBtn: "🗑 REMOVE",
  },
  shooter: {
    pdfHint: "Optional additional information printed on the PDF report.",
    birthDate: "Date of birth",
    courseNumber: "SRA course number or other identifier",
    club: "RU/RES/MPKL club",
    disqualificationReason: "Reason for disqualification:",
    scoreCardLink: "Score card »",
    recordDq: "Record disqualification",
    cancelDq: "Cancel disqualification",
    pdfReport: "PDF report",
    dqPrompt: "Reason for disqualifying {shooter}?",
    autoDqReason: "Hit factor below {factor}.",
  },
  scoring: {
    shootingNextWithLast:
      "Shooting. Next shooter {shooter}, the last shooter on this stage.",
    shootingNextFinal:
      "Shooting. Next shooter {shooter}, the final run of the test.",
    shootingNextWithUpcoming:
      "Shooting. Next shooter {shooter}, {next} preparing.",
    stage: "Stage",
    stageHeader: "Stage {stage} / {shooter}",
    method: "Method:",
    pistol: "Pistol",
    rifle: "Rifle",
    recordDq: "Record disqualification",
    cancelDq: "Cancel disqualification",
    stageDescription: "Stage description",
    close: "Close",
    hits: "Hits",
    points: "Points",
    hitClassMiss: "M",
    hitClassPenalty: "Pen",
    previousShooter: "Previous shooter",
    nextShooter: "Next shooter",
    confirmIncomplete:
      "The scoring entry is incomplete. Do you want to leave it unfinished?",
  },
  stages: {
    description: [
      "10 m. Starting position standing facing the targets, guide time 5 s/series. In series 1 and 2 the pistol is holstered; in series 3 the pistol is loaded on the table (or in hand if no table). SERIES 1: 2 shots per target, two-handed. SERIES 2: 2 shots per target with the stronger hand. SERIES 3: 2 shots per target with the weaker hand.",
      "10 m. Starting position pistol loaded in holster; series 1 back to targets, series 2 left side to targets, series 3 right side to targets. Guide time 5 s/series. SERIES 1: 180° turn and 2 shots per target. SERIES 2: 90° turn and 2 shots per target. SERIES 3: 90° turn and 2 shots per target.",
      "10 m. Starting position back to targets, hands up, pistol loaded in holster. Guide time 15 seconds; the shooter may choose to start from position A or B. Run: 180° turn and 2 shots into the target in front from position A or B, transition to the other position with a magazine change. From the second position B/A 2 shots into the target in front, then transition back to the start position with a magazine change. From the start position 2 shots into the target in front.",
      "20–15–10 m, guide time 25 seconds. Start standing facing the targets, pistol loaded in holster. Run: 2 shots per target from position A (20 m) standing; transition with magazine change to position B (15 m); 2 shots per target kneeling; transition with magazine change to position C (10 m); 2 shots per target prone. If prone is not feasible on the range, position C may also be kneeling.",
      "Optional rifle with barrel angled 45° downward or pistol loaded in holster. Guide time 15 seconds. Rifle: 20 m, start standing facing the targets. The shooter chooses to start from position A or B. From the start position 2 shots into each target, transition to position B/A, 2 shots into each target, transition to position C, 2 shots into each target. Pistol: 10–15 m, start standing at 10 m facing the targets. From 10 m 2 shots into each target, transition to 15 m, 2 shots into each target.",
    ],
  },
  scoreCard: {
    invalidLink:
      "Could not process result data from the link. Was it copied correctly?",
    title: "SRA Shooting Test",
    scoreCard: "Score card",
    columnStage: "Stage",
    columnHits: "Hits",
    columnPoints: "Points",
    columnTime: "Time",
    columnHfTooltip: "Hit factor: points divided by time (seconds).",
    total: "Total",
    resultLabel: "Result",
    dqReasonLabel: "Reason for disqualification",
    sraReferee: "SRA referee",
    share: "Share",
    copyLink: "Copy link",
    notStored:
      "Result data is not stored on any server. The results shown on this page are encoded into the QR code link itself.",
    parseFailed:
      "Failed to parse result data — was the link copied incorrectly?",
    copyPrompt: "Copy this link:",
    shareText: "SRA shooting test score card",
    documentTitle: "SRA shooting test score card",
  },
  safety: {
    heading: "Safety",
    intro:
      "The following safe firearms handling rules must be observed at all times:",
    rule1Bold: "Always handle a firearm as if it were loaded",
    rule1Body:
      "It does not matter whether the firearm is loaded or a non-functional dummy — handling must always be the same.",
    rule2Prefix: "Muzzle control, ",
    rule2Bold: "the muzzle must always point in a safe direction",
    rule2Body:
      'The "laser rule": never point the firearm at anything you are not willing to destroy.',
    rule3Prefix: "Trigger discipline, ",
    rule3Bold:
      "keep your finger off the trigger until you have decided to shoot",
    rule3Body:
      "The trigger finger must be kept consciously on the frame of the firearm. The finger only goes on the trigger after you have made a conscious decision to shoot.",
    rule4Bold: "Identify the target and check the background",
    rule4Body:
      "The target must always be identified before firing. There must be no friendlies or bystanders behind the target.",
    acknowledgment:
      "All participants of the shooting test understand the safe firearms handling rules above.",
    continue: "Continue",
  },
  about: {
    heading: "About",
    appVersion: "App version {version}",
    description:
      "This is a scoring tool for the practical shooting test of Applied Reservist Shooting (SRA). It can assist with scoring during shooting test events. SRA (Sovellettu reserviläisammunta) is a practical shooting discipline administered by the Finnish Reservists' Sports Federation. This app is not endorsed by or officially associated with the Federation, but may be useful for running test events and producing PDF result reports.",
    privacyHeading: "Privacy",
    privacyBody:
      "The scoring app stores: shooter names and the times and scores of each run. Data is stored only in this device's (browser's) memory. No data is uploaded to servers or cloud services.",
    linksHeading: "Links",
    feedbackHeading: "Feedback and development",
    feedbackBody:
      "If you find issues or have suggestions, contact the developer Magnus von Wachenfeldt directly at ",
    githubLink: "Project on GitHub",
    changelogHeading: "Changelog",
    creditsHeading: "Credits",
    creditsBody:
      "This app is based on the hard work of Matti Pöllä on the original scoring tool. The source code of the original is available at ",
  },
};
