<script setup lang="ts">
import { useScoresStore } from "@/stores/scores";
import { SraShootingTest } from "@/classes/SraShootingTest";
import { computed } from "vue";

const scoresStore = useScoresStore();

interface Props {
  shooter: string;
  stage: number;
  hitClass: string;
  target: number;
}
const props = defineProps<Props>();

const minHits = 0;

/** Number of hits of this hit class (A/C/D/Miss/Penalty) on this target. */
const hitCount = computed({
  get() {
    return scoresStore.scores[props.shooter][props.stage][
      SraShootingTest.hitClasses.indexOf(props.hitClass)
    ][props.target];
  },
  set(newValue: number) {
    scoresStore.scores[props.shooter][props.stage][
      SraShootingTest.hitClasses.indexOf(props.hitClass)
    ][props.target] = newValue;
  },
});

/** Number of penalties for this target. */
const penaltyCount = computed({
  get() {
    return scoresStore.scores[props.shooter][props.stage][
      SraShootingTest.hitClasses.indexOf("Penalty")
    ][props.target];
  },
  set(newValue: number) {
    scoresStore.scores[props.shooter][props.stage][
      SraShootingTest.hitClasses.indexOf("Penalty")
    ][props.target] = newValue;
  },
});

const maxHits = computed(() => {
  // Penalties have no actual maximum count
  if (props.hitClass == "Penalty") {
    return 100;
  }
  if (scoresStore.stage5Methods[props.shooter] == "kiv") {
    return (
      SraShootingTest.shotCountsWithRifle[props.stage][props.target] -
      (scoresStore.scores[props.shooter][props.stage].reduce(
        (acc, cur) => acc + Number(cur[props.target]),
        0,
      ) -
        hitCount.value -
        penaltyCount.value)
    );
  } else {
    return (
      SraShootingTest.shotCountsWithPistol[props.stage][props.target] -
      (scoresStore.scores[props.shooter][props.stage].reduce(
        (acc, cur) => acc + Number(cur[props.target]),
        0,
      ) -
        hitCount.value -
        penaltyCount.value)
    );
  }
});

const minus = () => {
  if (hitCount.value > minHits) {
    hitCount.value--;
  }
};

const plus = () => {
  if (hitCount.value < maxHits.value || props.hitClass == "Penalty") {
    hitCount.value++;
  }
};
</script>

<template>
  <div class="hit-counter">
    <button
      @click="minus()"
      :disabled="
        hitCount === minHits || shooter in scoresStore.disqualifications
      "
      :id="'T' + target + hitClass + 'minus'"
    >
      -
    </button>
    <input
      class="hits"
      v-model="hitCount"
      type="number"
      :disabled="shooter in scoresStore.disqualifications"
    />
    <button
      @click="plus()"
      :disabled="
        (hitClass != 'Penalty' && hitCount >= maxHits) ||
        shooter in scoresStore.disqualifications
      "
      :id="'T' + target + hitClass + 'plus'"
    >
      +
    </button>
  </div>
</template>

<style scoped>
/* +/- hit buttons always on the same row. */
.hit-counter {
  white-space: nowrap;
}

button {
  width: 1.9rem;
  height: 1.9rem;
}

button:disabled {
  color: #999;
}

input.hits {
  width: 2.5rem;
  height: 2rem;
  font-size: 120%;
  background: #fff9d6;
  border: none;
  text-align: center;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
