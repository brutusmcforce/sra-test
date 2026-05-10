import { useScoresStore } from '@/stores/scores'

/**
 * Helpers for moving between shooter/stage cells in the scoring view.
 *
 * Order rotation: when `scoresStore.order === 'rotating'`, the shooter list
 * shifts by `stage` positions so that the first shooter of stage N becomes
 * the last shooter of stage N+1.
 */
export function useStageNavigation() {
  const scoresStore = useScoresStore()

  const isDq = (shooter: string) => shooter in scoresStore.disqualifications

  const rotateOrder = (shooters: string[], stage: number): string[] => {
    if (scoresStore.order !== 'rotating') return shooters
    const rotated = [...shooters]
    for (let i = 0; i < stage; i++) {
      rotated.push(rotated.shift() as string)
    }
    return rotated
  }

  const nextNonDqShooter = (shooters: string[]): string | null =>
    shooters.find((s) => !isDq(s)) ?? null

  const previousNonDqShooter = (shooters: string[]): string | null =>
    nextNonDqShooter([...shooters].reverse())

  const stageOrder = (stage: number) =>
    rotateOrder(Object.keys(scoresStore.scores), stage)

  const stageNextShooter = (stage: number, shooter: string): string | null => {
    const order = stageOrder(stage)
    return nextNonDqShooter(order.slice(order.indexOf(shooter) + 1))
  }

  const stagePreviousShooter = (stage: number, shooter: string): string | null => {
    const order = stageOrder(stage)
    return previousNonDqShooter(order.slice(0, order.indexOf(shooter)))
  }

  /** URL of the next scoring entry, or '/' when finishing the test. */
  const nextLink = (stage: number, shooter: string): string => {
    const next = stageNextShooter(stage, shooter)
    if (next) return `/entry/${stage}/${next}`
    if (stage === 4) return '/'
    return `/entry/${stage + 1}/${stageOrder(stage + 1)[0]}`
  }

  /** URL of the previous scoring entry, or '/' when going before the first. */
  const previousLink = (stage: number, shooter: string): string => {
    const previous = stagePreviousShooter(stage, shooter)
    if (previous) return `/entry/${stage}/${previous}`
    if (stage === 0) return '/'
    const previousStageOrder = stageOrder(stage - 1)
    const lastNonDq = [...previousStageOrder].reverse().find((s) => !isDq(s))
    return `/entry/${stage - 1}/${lastNonDq}`
  }

  /**
   * Returns the shortest unambiguous form of a shooter's name:
   * - "Mikko" if no one else shares the first name
   * - "Mikko V" if the first-name initial of the last name disambiguates
   * - the full name otherwise
   */
  const shortenName = (fullName: string): string => {
    const initial = (name: string) =>
      name.split(' ').length > 1
        ? `${name.split(' ')[0]} ${name.split(' ')[1].replace(/[a-z]/g, '')}`
        : name.split(' ')[0]

    const names = Object.keys(scoresStore.scores)
    const firstName = fullName.split(' ')[0]
    const myInitial = initial(fullName)

    const firstNameClash = names.filter((n) => n.split(' ')[0] === firstName).length > 1
    if (!firstNameClash) return firstName

    const initialClash = names.filter((n) => initial(n) === myInitial).length > 1
    if (!initialClash) return myInitial

    return fullName
  }

  return {
    rotateOrder,
    stageNextShooter,
    stagePreviousShooter,
    nextLink,
    previousLink,
    shortenName,
  }
}
