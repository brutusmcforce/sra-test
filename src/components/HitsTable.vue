<script setup lang="ts">
import { computed } from 'vue'
import { Check } from '@iconoir/vue'
import { useI18n } from 'vue-i18n'
import { useScoresStore } from '@/stores/scores'
import { SraShootingTest } from '@/classes/SraShootingTest'
import StageScoreRow from '@/components/StageScoreRow.vue'

const props = defineProps<{
  shooter: string
  stage: number
}>()

const scoresStore = useScoresStore()
const { t } = useI18n()

const disabled = computed(() => props.shooter in scoresStore.disqualifications)

const requiredShots = (target: number): number => {
  const counts = scoresStore.stage5Methods[props.shooter] === 'kiv'
    ? SraShootingTest.shotCountsWithRifle
    : SraShootingTest.shotCountsWithPistol
  return counts[props.stage][target]
}

const targetScoringComplete = (target: number): boolean => {
  const scored = scoresStore.scores[props.shooter][props.stage]
    .reduce((acc, cur) => acc + Number(cur[target]), 0)
  return scored >= requiredShots(target)
}
</script>

<template>
  <table cellspacing="0" class="stage" :class="{ dq: disabled }">
    <thead>
      <tr>
        <th class="hit-class"></th>
        <th
          v-for="target in [0, 1]"
          :key="target"
          class="target"
          :class="targetScoringComplete(target) ? 'ok' : 'notok'"
        >
          <span>
            <Check v-if="targetScoringComplete(target)" stroke-width="3" color="darkgreen" />
            <span v-else>T{{ target + 1 }}</span>
          </span>
        </th>
        <th class="hits">{{ t('scoring.hits') }}</th>
        <th class="points">{{ t('scoring.points') }}</th>
      </tr>
    </thead>
    <tbody>
      <StageScoreRow
        v-for="(hitClass, idx) in SraShootingTest.hitClasses"
        :key="idx"
        :shooter="shooter"
        :stage="stage"
        :hitClass="hitClass"
      />
      <tr>
        <td class="inv"></td>
        <td class="inv"></td>
        <td></td>
        <td></td>
        <td>{{ scoresStore.getShooterStagePointSum(shooter, stage) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table.stage {
  border-radius: 0.3rem;
  background: var(--color2);
  color: #222;
  width: 100%;
}
table.stage td {
  background: rgba(255, 255, 255, 0.5);
  text-align: center;
}

th {
  font-size: 140%;
  background-color: var(--color2);
}
th.hit-class { width: 10%; }
th.target {
  width: 20%;
  height: 60px;
  vertical-align: bottom;
  background: url('../assets/logo.svg') no-repeat top / 40%;
  background-color: var(--color2);
}
th.target.ok span {
  color: darkgreen;
  font-weight: bold;
}
th.target.notok span {
  color: #4d4032;
}
th.hits,
th.points {
  width: 8%;
  font-size: 100%;
}

.stage.dq,
.stage.dq tr,
.stage.dq th,
.stage.dq td,
.stage.dq td input {
  background-color: #c7c7c7;
}
</style>
