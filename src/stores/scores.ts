import {defineStore} from 'pinia'
import {StageStatus, SraShootingTest} from "@/classes/SraShootingTest";

type ShooterScores = {
  [name: string]: Array<Array<Array<number>>>
}
type ShooterTimes = {
  [name: string]: Array<Array<number>>
}
type Disqualifications = {
  [name: string]: string
}
type Stage5Methods = {
  [name: string]: string
}
type BirthDates = {
  [name: string]: Date
}
type CourseNumbers = {
  [name: string]: string
}
type Clubs = {
  [name: string]: string
}

const orderIsSame = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((el, idx) => el === b[idx]);
}

// NOTE: persistence key kept as 'pisteet' so existing users' saved data continues to load
export const useScoresStore = defineStore('pisteet', {
  state: () => ({
    safetyTrainingCompleted: false,
    count: 0,
    scores: {} as ShooterScores,
    times: {} as ShooterTimes,
    disqualifications: {} as Disqualifications,
    stage5Methods: {} as Stage5Methods,
    birthDates: {} as BirthDates,
    courseNumbers: {} as CourseNumbers,
    clubs: {} as Clubs,
    order: '',
    referee_name: '',
    referee_sraid: '',
    referee_phone: '',
    testEvent_place: '',
    testEvent_date: ''
  }),
  persist: true,
  actions: {
    addShooter(name: any) {
      this.scores[name] = new Array(5).fill(0).map(() => new Array(6).fill(0).map(() => new Array(2).fill(0)))
      this.times[name] = new Array(5).fill(0).map(() => new Array(3).fill(0))
      this.stage5Methods[name] = 'pist'
      // When a new shooter is added, fresh confirmation that safety training was given to all is required
      this.safetyTrainingCompleted = false
    },
    setBirthDate(shooter: string, date: Date) {
      this.birthDates[shooter] = date
    },
    setCourseNumber(shooter: string, courseNumber: string) {
      this.courseNumbers[shooter] = courseNumber
    },
    setClub(shooter: string, club: string) {
      this.clubs[shooter] = club
    },
    getShooterStageTime(name: string, stage: number) {
      return this.times[name][stage].reduce((a, b) => Number(a) + Number(b), 0)
    },
    getShooterStageTimes(name: any, stage: any) {
      return this.times[name][stage]
    },
    getShooterStageClassHits(shooter: string, stage: number) {
      return this.scores[shooter][stage].map((it) => it.reduce((a,b) => a+b, 0))
    },
    getClassPoints(hitClass: number, hits: number) {
      switch(hitClass) {
        case 0:
          return 5 * hits
        case 1:
          return 3 * hits
        case 2:
          return hits
        case 3:
        case 4:
          return -10 * hits
      }
      return 0
    },
    getShooterStagePoints(shooter: string, stage: number) {
      return this.getShooterStageClassHits(shooter, stage).map((hits, index) => this.getClassPoints(index, hits))
    },
    getShooterStagePointSum(shooter: string, stage: number) {
      const sum = this.getShooterStagePoints(shooter, stage).reduce((a, b) => a + b, 0)
      // TODO: Can a stage's point sum be negative? Assumption: no.
      return Math.max(0, sum)
    },
    // Shooter's total points (partially completed stages are not counted)
    getShooterPointSum(shooter: string) : number {
      return [0,1,2,3,4].map((stage) =>
          this.getStageStatus(shooter, stage) == StageStatus.Completed ? this.getShooterStagePointSum(shooter, stage) : 0).reduce((a, b) => a + b)
    },
    getShooterHitsByClass(shooter: string) : number {
      return [0,1,2,3,4].map((stage) =>
          this.getShooterStageClassHits(shooter, stage).reduce((a, b) => a + b))
    },
    // Shooter's total time (partially completed stages are not counted)
    getShooterTimeSum(shooter: string) : number {
      return [0, 1, 2, 3, 4].map(stage =>
          this.getStageStatus(shooter, stage) == StageStatus.Completed ? this.times[shooter][stage].reduce((a,b)=> a + b, 0) : 0)
          .reduce((a,b)=>a+b,0)
    },
    getShooterHitFactor(shooter: string) : number {
      return this.getShooterPointSum(shooter) / this.getShooterTimeSum(shooter)
    },
    getAllShot(shooter: string) : boolean {
      return [0,1,2,3,4].map((x) => this.getStageStatus(shooter, x)).filter(num => num === StageStatus.Completed).length === 5
    },
    getStageStatus(shooter: string, stage: number) {

      // Are all shots scored?
      const scoredHits = this.getShooterStageClassHits(shooter, stage).reduce((a, b) => a + b, 0)

      const stageShotCount = this.stage5Methods[shooter] === 'pist' ? SraShootingTest.shotCountsWithPistol[stage].reduce((a,b)=> a + b, 0) : SraShootingTest.shotCountsWithRifle[stage].reduce((a,b)=> a + b, 0)

      let timesRecorded = false
      // Are all times recorded (stages 1-2 have three different times)?
      if (stage == 0 || stage == 1) {
        timesRecorded = [0, 1, 2].map((x) => this.times[shooter][stage][x]).indexOf(0) == -1
      } else {
        timesRecorded = (this.times[shooter][stage][0] > 0)
      }

      // In progress: only some hits are recorded or time entry is missing
      if ((scoredHits > 0 && scoredHits < stageShotCount) || (scoredHits > 0 && !timesRecorded) || (scoredHits == 0 && timesRecorded)) {
        return StageStatus.InProgress
      }
      // All shots are scored and times are recorded
      if (scoredHits >= stageShotCount && timesRecorded) {
        return StageStatus.Completed
      }
      // Otherwise the stage has not been started
      return StageStatus.NotStarted
    },

    stageCompleted(shooter: string, stage: number) {
      return this.getStageStatus(shooter, stage) == StageStatus.Completed
    },

    removeShooter(shooter: string) {
      delete this.scores[shooter]
      delete this.times[shooter]
      delete this.disqualifications[shooter]
      delete this.stage5Methods[shooter]
      delete this.birthDates[shooter]
      delete this.courseNumbers[shooter]
      delete this.clubs[shooter]

      // Safety training acknowledgement expires if all participants are removed.
      if (Object.keys(this.times).length == 0) {
        this.safetyTrainingCompleted = false
      }
    },
    getAllStagesCompleted(shooter: string) {
      return [0,1,2,3,4].map((x) => this.getStageStatus(shooter, x)).filter((x) => x === StageStatus.Completed).length === 5
    },
    /**
     * Returns the manually recorded disqualification reason, or null if not disqualified.
     * For an auto-disqualification (hit factor below threshold), use `isAutoDisqualified`
     * and format the reason at the UI layer (with i18n).
     */
    getDisqualificationReason(shooter: string): string | null {
      if (this.disqualifications[shooter] != null) {
        return this.disqualifications[shooter]
      }
      return null
    },
    isAutoDisqualified(shooter: string): boolean {
      return this.disqualifications[shooter] == null
        && this.getAllShot(shooter)
        && this.getShooterHitFactor(shooter) < SraShootingTest.requiredHitFactor
    },
    isDisqualified(shooter: string): boolean {
      return this.disqualifications[shooter] != null || this.isAutoDisqualified(shooter)
    },
    recordDisqualification(shooter: string, reason: string) {
      this.disqualifications[shooter] = reason
    },
    getDateAndPlace(): string {
      let k = ""
      if (this.testEvent_date != null) {
        k = k.concat(this.testEvent_date)
      }
      if (this.testEvent_place != null) {
        k = k.concat(" " + this.testEvent_place)
      }
      return k
    },
    getRefereeName(): string {
      if (this.referee_name != null) {
        return this.referee_name
      }
      return null
    },
    getRefereeNumber(): string {
      if (this.referee_sraid != null) {
        return this.referee_sraid
      }
      return null
    },

    cancelDisqualification(shooter: string) {
      delete this.disqualifications[shooter]
    },
    reset() {
      this.scores = {}
      this.times =  {}
      this.disqualifications = {}
      this.stage5Methods = {}
      this.safetyTrainingCompleted = false
      this.order = "rotating"
      this.testEvent_place = ''
      this.testEvent_date = ''
      this.birthDates = {}
      this.courseNumbers = {}
      this.clubs = {}
    },
    // Randomize the shooter order
    randomizeOrder() {
      const currentOrder = Object.keys(this.scores)
      let newOrder = currentOrder
      do {
        newOrder = Object.keys(this.scores).sort(() => Math.random() - 0.5)
      } while (orderIsSame(currentOrder, newOrder))
      this.scores = Object.fromEntries(newOrder.map(k => [k, this.scores[k]]))
    }
  },
})
