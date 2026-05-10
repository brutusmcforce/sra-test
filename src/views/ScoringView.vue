<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { InfoCircle, Prohibition, Undo } from '@iconoir/vue'

import { useScoresStore } from '@/stores/scores'
import { StageStatus, SraShootingTest } from '@/classes/SraShootingTest'
import { recordDisqualification, cancelDisqualification } from '@/classes/Util'
import { useStageNavigation } from '@/composables/useStageNavigation'

import StageBreadcrumb from '@/components/StageBreadcrumb.vue'
import ShooterChips from '@/components/ShooterChips.vue'
import TimeEntryTable from '@/components/TimeEntryTable.vue'
import HitsTable from '@/components/HitsTable.vue'
import StageInfoModal from '@/components/StageInfoModal.vue'

const route = useRoute()
const router = useRouter()
const scoresStore = useScoresStore()
const { t } = useI18n()
const { nextLink, previousLink, stageNextShooter } = useStageNavigation()

const shooter = computed(
  () => (route.params.shooter as string) ?? Object.keys(scoresStore.scores)[0]
)
const stage = computed(() => Number(route.params.stage ?? 0))

const showStageInfo = ref(false)

const isDq = computed(() => shooter.value in scoresStore.disqualifications)

const stageHitFactor = computed(() => {
  if (scoresStore.getStageStatus(shooter.value, stage.value) !== StageStatus.Completed) {
    return 0
  }
  const points = scoresStore.getShooterStagePointSum(shooter.value, stage.value)
  const time = scoresStore.getShooterStageTime(shooter.value, stage.value)
  return points / time
})

const stageHitFactorOk = computed(
  () => stageHitFactor.value >= SraShootingTest.requiredHitFactor
)

const formatHitFactor = (hf: number) => (hf === 0 ? '' : `HF ${hf.toFixed(2)}`)

const instructionPhrase = computed((): string => {
  const next = stageNextShooter(stage.value, shooter.value)
  if (next) {
    return t('scoring.shootingNextWithUpcoming', { shooter: shooter.value, next })
  }
  if (stage.value < 4) {
    return t('scoring.shootingNextWithLast', { shooter: shooter.value })
  }
  return t('scoring.shootingNextFinal', { shooter: shooter.value })
})

const onRecordDq = () =>
  recordDisqualification(scoresStore, shooter.value, t('shooter.dqPrompt', { shooter: shooter.value }))
const onCancelDq = () => cancelDisqualification(scoresStore, shooter.value)

const targetScoringComplete = (target: number): boolean => {
  const counts = scoresStore.stage5Methods[shooter.value] === 'kiv'
    ? SraShootingTest.shotCountsWithRifle
    : SraShootingTest.shotCountsWithPistol
  const scored = scoresStore.scores[shooter.value][stage.value]
    .reduce((acc, cur) => acc + Number(cur[target]), 0)
  return scored >= counts[stage.value][target]
}

const isEntryIncomplete = (): boolean => {
  const times = scoresStore.getShooterStageTimes(shooter.value, stage.value)
  const needsThreeTimes = stage.value <= 1
  if (!(times[0] > 0)) return true
  if (needsThreeTimes && !(times[1] > 0)) return true
  if (needsThreeTimes && !(times[2] > 0)) return true
  if (!targetScoringComplete(0)) return true
  if (!targetScoringComplete(1)) return true
  return false
}

const confirmAndGo = (to: string) => {
  if (!isEntryIncomplete() || confirm(t('scoring.confirmIncomplete'))) {
    router.push(to)
  }
}
</script>

<template>
  <main>
    <StageBreadcrumb :shooter="shooter" :current-stage="stage" />
    <ShooterChips :shooter="shooter" :stage="stage" />

    <div class="main">
      <div v-if="!isDq" class="instruction">
        "{{ instructionPhrase }}"
      </div>

      <div class="stage-header-bar">
        <h2 class="stage-header">
          {{ t('scoring.stageHeader', { stage: stage + 1, shooter }) }}
        </h2>
        <div class="result" :class="stageHitFactorOk ? 'ok' : 'notok'">
          {{ formatHitFactor(stageHitFactor) }}
        </div>
      </div>

      <fieldset v-if="stage === 4">
        <legend>{{ t('scoring.method') }}</legend>
        <div>
          <input type="radio" id="pist" value="pist" v-model="scoresStore.stage5Methods[shooter]" />
          <label for="pist">{{ t('scoring.pistol') }}</label>
          <input type="radio" id="kiv" value="kiv" v-model="scoresStore.stage5Methods[shooter]" />
          <label for="kiv">{{ t('scoring.rifle') }}</label>
        </div>
      </fieldset>

      <div class="actions">
        <button v-if="!isDq" class="action dq" @click="onRecordDq">
          <Prohibition /> {{ t('scoring.recordDq') }}
        </button>
        <button v-else class="action" @click="onCancelDq">
          <Undo /> {{ t('scoring.cancelDq') }}
        </button>
        <button class="action" @click="showStageInfo = true">
          <InfoCircle /> {{ t('scoring.stageDescription') }}
        </button>
      </div>

      <StageInfoModal v-if="showStageInfo" :stage="stage" @close="showStageInfo = false" />

      <TimeEntryTable :shooter="shooter" :stage="stage" />
      <br />
      <HitsTable :shooter="shooter" :stage="stage" />

      <div class="actions">
        <button class="action" @click="confirmAndGo(previousLink(stage, shooter))">
          {{ t('scoring.previousShooter') }}
        </button>
        <button class="action" @click="confirmAndGo(nextLink(stage, shooter))">
          {{ t('scoring.nextShooter') }}
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  margin: 0 0.2rem;
}

label {
  padding: 0 2rem 0 0.5rem;
}

.stage-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stage-header-bar .stage-header { color: #222; }
.stage-header-bar .result {
  min-width: 4rem;
  padding: 0.3rem;
}
.stage-header-bar .result.ok { color: var(--color1); }
.stage-header-bar .result.notok { color: #363636; }

.instruction {
  font-size: 1em;
  padding: 0.3rem;
  border-radius: 10px;
  background: #cadbe7;
  color: #224;
  width: 85%;
  position: relative;
  margin: 0.5rem auto;
  font-style: italic;
  text-align: center;
  border: 1px solid #cadbe7;
}
.instruction::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  border: 1.618em solid transparent;
  border-right-color: #cadbe7;
  border-left: 0;
  border-top: 0;
  margin: -0.809em 0 0 -1.618em;
}
</style>
