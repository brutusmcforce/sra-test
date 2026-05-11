<template>
  <tr class="result-row">
    <th class="hit-class">{{ hitClassLabel(props.hitClass) }}</th>
    <td class="ballpoint-pen">{{ hitCountTarget0 > 0 ?  hitCountTarget0 : "" }}</td>
    <td class="ballpoint-pen">{{ hitCountTarget1 > 0 ? hitCountTarget1 : "" }}</td>
    <td class="ballpoint-pen">{{ hitSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) > 0 ? hitSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) : "" }}</td>
    <td class="ballpoint-pen">{{ pointSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) > 0 ? pointSum(scoresStore.scores[props.shooter][props.stage], SraShootingTest.hitClasses.indexOf(props.hitClass)) : "" }}</td>
    <td class="ballpoint-pen"><span class="phase" v-if="props.stage < 2 && SraShootingTest.hitClasses.indexOf(props.hitClass) < 3">{{ SraShootingTest.hitClasses.indexOf(props.hitClass) }}</span>
      {{
        scoresStore.getShooterStageTimes(props.shooter, props.stage)[SraShootingTest.hitClasses.indexOf(props.hitClass)] > 0 ? scoresStore.getShooterStageTimes(props.shooter, props.stage)[SraShootingTest.hitClasses.indexOf(props.hitClass)] : ""
      }}
    </td>
  </tr>

</template>

<script setup lang="ts">
import { useScoresStore } from '@/stores/scores'
import {SraShootingTest} from "@/classes/SraShootingTest";
import {computed} from "vue";
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

const hitCountTarget0 = computed( () =>  {
    return scoresStore.scores[props.shooter][props.stage][SraShootingTest.hitClasses.indexOf(props.hitClass)][0]
  })
const hitCountTarget1 = computed( () =>  {
    return scoresStore.scores[props.shooter][props.stage][SraShootingTest.hitClasses.indexOf(props.hitClass)][1]
  })


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

<style scoped>


.result-row {
  height: 1.5rem;
}

.hit-class {
  border: 2px solid black;
  font-size: 85%;
}


.ballpoint-pen {
  border: 2px solid black;
  text-align: center;
  font-family: sans-serif;
  font-weight: bolder;
  color: #2a2aab;
  font-size: 100%;
}

th {
  font-weight: bold;
}

.phase {
  background-color: #8f9d8f;
  position: relative;

}

</style>
