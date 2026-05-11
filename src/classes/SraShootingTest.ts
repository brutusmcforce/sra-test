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
    [4, 4],
  ];

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
    [6, 6],
  ];

  static hitClasses = ["A", "C", "D", "Miss", "Penalty"];

  static stages = [0, 1, 2, 3, 4];

  static requiredHitFactor = 1.3;

  static hitScoring = { A: 5, C: 3, D: 1, Miss: -10, Penalty: -10 };
}

export enum StageStatus {
  NotStarted,
  InProgress,
  Completed,
}

export enum TestStatus {
  NotStarted,
  InProgress,
  Failed,
  Passed,
}
