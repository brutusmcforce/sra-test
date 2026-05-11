<script setup lang="ts">
import { useScoresStore } from '@/stores/scores'
import { SraShootingTest } from "@/classes/SraShootingTest"
import HitCounter from "@/components/HitCounter.vue"
import { useI18n } from 'vue-i18n'


const scoresStore = useScoresStore()
const { t } = useI18n()

interface Props {
  shooter: string,
  stage: number,
  hitClass: string
}
const props = defineProps<Props>()

const hitClassLabel = (cls: string): string => {
  if (cls === "Miss") return t("scoring.hitClassMiss")
  if (cls === "Penalty") return t("scoring.hitClassPenalty")
  return cls
}

const hitSum = (sc: Array<Array<number>>, classIdx: number) : number => {
  return sc[classIdx].reduce((a, b) => Number(a) + Number(b), 0)
}

const pointSum = (sc: Array<Array<number>>, classIdx: number) : number => {

  switch (classIdx) {
      // A
    case 0:
      return 5 * hitSum(sc, classIdx)
      // C
    case 1:
      return 3 * hitSum(sc, classIdx)
      // D
    case 2:
      return hitSum(sc, classIdx)
      // Miss and Penalty
    case 3:
    case 4:
      return -10 * hitSum(sc, classIdx)
  }
  return 0
}

</script>


<template>
  <tr>
    <td>{{ hitClassLabel(props.hitClass) }}</td>
    <td>
      <HitCounter :shooter="shooter" :stage="stage" :hitClass="props.hitClass" :target="0" />
    </td>
    <td>
      <HitCounter :shooter="shooter" :stage="stage" :hitClass="props.hitClass" :target="1" />
    </td>
    <td>{{ hitSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) }}</td>
    <td>{{ pointSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) }}</td>
  </tr>

</template>
