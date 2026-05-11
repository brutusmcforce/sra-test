import { defineStore } from "pinia";
import { StageStatus, SraShootingTest } from "@/classes/SraShootingTest";

type ShooterScores = Record<string, number[][][]>;
type ShooterTimes = Record<string, number[][]>;

const STAGES = [0, 1, 2, 3, 4];

const orderIsSame = (a: string[], b: string[]) =>
  a.length === b.length && a.every((el, idx) => el === b[idx]);

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export type ScoresStore = ReturnType<typeof useScoresStore>;

export const useScoresStore = defineStore("score", {
  state: () => ({
    safetyTrainingCompleted: false,
    scores: {} as ShooterScores,
    times: {} as ShooterTimes,
    disqualifications: {} as Record<string, string>,
    stage5Methods: {} as Record<string, string>,
    birthDates: {} as Record<string, string>,
    courseNumbers: {} as Record<string, string>,
    clubs: {} as Record<string, string>,
    shooterClasses: {} as Record<string, string>,
    order: "",
    referee_name: "",
    referee_sraid: "",
    referee_phone: "",
    testEvent_place: "",
    testEvent_date: "",
  }),
  persist: true,
  actions: {
    addShooter(name: string) {
      this.scores[name] = Array.from({ length: 5 }, () =>
        Array.from({ length: 6 }, () => [0, 0]),
      );
      this.times[name] = Array.from({ length: 5 }, () => [0, 0, 0]);
      this.stage5Methods[name] = "pist";
      this.shooterClasses[name] = "Militär";

      this.safetyTrainingCompleted = false;
    },
    removeShooter(shooter: string) {
      delete this.scores[shooter];
      delete this.times[shooter];
      delete this.disqualifications[shooter];
      delete this.stage5Methods[shooter];
      delete this.birthDates[shooter];
      delete this.courseNumbers[shooter];
      delete this.clubs[shooter];
      delete this.shooterClasses[shooter];

      if (Object.keys(this.times).length === 0) {
        this.safetyTrainingCompleted = false;
      }
    },
    setBirthDate(shooter: string, date: string) {
      this.birthDates[shooter] = date;
    },
    setCourseNumber(shooter: string, courseNumber: string) {
      this.courseNumbers[shooter] = courseNumber;
    },
    setClub(shooter: string, club: string) {
      this.clubs[shooter] = club;
    },
    setShooterClass(shooter: string, shooterClass: string) {
      this.shooterClasses[shooter] = shooterClass;
    },

    getShooterStageTimes(shooter: string, stage: number): number[] {
      return this.times[shooter][stage];
    },
    getShooterStageTime(shooter: string, stage: number): number {
      return sum(this.times[shooter][stage].map(Number));
    },
    getShooterStageClassHits(shooter: string, stage: number): number[] {
      return this.scores[shooter][stage].map((row) => sum(row));
    },
    getShooterStagePoints(shooter: string, stage: number): number[] {
      return this.getShooterStageClassHits(shooter, stage).map(
        (hits, classIdx) => classPoints(classIdx, hits),
      );
    },
    getShooterStagePointSum(shooter: string, stage: number): number {
      return Math.max(0, sum(this.getShooterStagePoints(shooter, stage)));
    },
    getShooterPointSum(shooter: string): number {
      return sum(
        STAGES.map((stage) =>
          this.getStageStatus(shooter, stage) === StageStatus.Completed
            ? this.getShooterStagePointSum(shooter, stage)
            : 0,
        ),
      );
    },
    /** Sum of times from completed stages only. */
    getShooterTimeSum(shooter: string): number {
      return sum(
        STAGES.map((stage) =>
          this.getStageStatus(shooter, stage) === StageStatus.Completed
            ? sum(this.times[shooter][stage])
            : 0,
        ),
      );
    },
    getShooterHitFactor(shooter: string): number {
      return this.getShooterPointSum(shooter) / this.getShooterTimeSum(shooter);
    },
    getAllShot(shooter: string): boolean {
      return STAGES.every(
        (stage) =>
          this.getStageStatus(shooter, stage) === StageStatus.Completed,
      );
    },
    getStageStatus(shooter: string, stage: number): StageStatus {
      const scoredHits = sum(this.getShooterStageClassHits(shooter, stage));
      const requiredShots =
        this.stage5Methods[shooter] === "pist"
          ? sum(SraShootingTest.shotCountsWithPistol[stage])
          : sum(SraShootingTest.shotCountsWithRifle[stage]);

      // Stages 1 and 2 (indexes 0/1) record three series times; later stages record one.
      const timesRecorded =
        stage <= 1
          ? this.times[shooter][stage].slice(0, 3).every((t) => t > 0)
          : this.times[shooter][stage][0] > 0;

      if (
        (scoredHits > 0 && scoredHits < requiredShots) ||
        (scoredHits > 0 && !timesRecorded) ||
        (scoredHits === 0 && timesRecorded)
      ) {
        return StageStatus.InProgress;
      }
      if (scoredHits >= requiredShots && timesRecorded) {
        return StageStatus.Completed;
      }
      return StageStatus.NotStarted;
    },
    getAllStagesCompleted(shooter: string): boolean {
      return this.getAllShot(shooter);
    },
    getDisqualificationReason(shooter: string): string | null {
      return this.disqualifications[shooter] ?? null;
    },
    isAutoDisqualified(shooter: string): boolean {
      return (
        this.disqualifications[shooter] == null &&
        this.getAllShot(shooter) &&
        this.getShooterHitFactor(shooter) < SraShootingTest.requiredHitFactor
      );
    },
    isDisqualified(shooter: string): boolean {
      return (
        this.disqualifications[shooter] != null ||
        this.isAutoDisqualified(shooter)
      );
    },
    recordDisqualification(shooter: string, reason: string) {
      this.disqualifications[shooter] = reason;
    },
    cancelDisqualification(shooter: string) {
      delete this.disqualifications[shooter];
    },

    getDateAndPlace(): string {
      return [this.testEvent_date, this.testEvent_place]
        .filter(Boolean)
        .join(" ");
    },
    getRefereeName(): string {
      return this.referee_name ?? "";
    },
    getRefereeNumber(): string {
      return this.referee_sraid ?? "";
    },

    reset() {
      this.scores = {};
      this.times = {};
      this.disqualifications = {};
      this.stage5Methods = {};
      this.safetyTrainingCompleted = false;
      this.order = "rotating";
      this.testEvent_place = "";
      this.testEvent_date = "";
      this.birthDates = {};
      this.courseNumbers = {};
      this.clubs = {};
      this.shooterClasses = {};
    },
    randomizeOrder() {
      const current = Object.keys(this.scores);
      let next = current;
      do {
        next = [...current].sort(() => Math.random() - 0.5);
      } while (orderIsSame(current, next));
      this.scores = Object.fromEntries(next.map((k) => [k, this.scores[k]]));
    },
  },
});

function classPoints(classIdx: number, hits: number): number {
  switch (classIdx) {
    case 0:
      return 5 * hits; // A
    case 1:
      return 3 * hits; // C
    case 2:
      return hits; // D
    case 3: // miss
    case 4:
      return -10 * hits; // penalty
  }
  return 0;
}
