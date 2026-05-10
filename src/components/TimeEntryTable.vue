<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Check } from '@iconoir/vue'
import { useScoresStore } from '@/stores/scores'

const props = defineProps<{
  shooter: string
  stage: number
}>()

const scoresStore = useScoresStore()

const disabled = computed(() => props.shooter in scoresStore.disqualifications)
const times = computed(() => scoresStore.getShooterStageTimes(props.shooter, props.stage))
// Stages 1 and 2 (indexes 0/1) record three series times; later stages record one.
const rows = computed(() => (props.stage <= 1 ? [0, 1, 2] : [0]))

/**
 * If more than two digits are entered (without a decimal point), the last two
 * are interpreted as hundredths of a second and the leading digits as seconds.
 * Example: "1398" → "13.98".
 */
const parseEnteredTime = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value.length < 3 || /^[0-9]{0,4}\.[0-9]{2}$/.test(input.value)) {
    return
  }
  const digits = input.value.replace(/[^0-9]/g, '').replace(/^0+/, '').padStart(3, '0')
  if (digits.length >= 2) {
    const seconds = digits.slice(0, -2)
    const hundredths = digits.slice(-2)
    input.value = `${seconds}.${hundredths}`
    input.dispatchEvent(new InputEvent('input'))
  }
}
</script>

<template>
  <table class="stage" :class="{ dq: disabled }">
    <tbody>
      <tr v-for="i in rows" :key="i">
        <th class="time" :class="times[i] > 0 ? 'ok' : 'notok'">
          <Check v-if="times[i] > 0" stroke-width="3" color="darkgreen" />
          <Clock v-else />
        </th>
        <td>
          <input
            :id="`time${i + 1}`"
            class="seconds"
            type="number"
            min="0.00"
            step="0.01"
            v-model="times[i]"
            :disabled="disabled"
            onfocus="this.select()"
            @keyup="parseEnteredTime"
          />
        </td>
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

th.time {
  width: 24%;
  padding: 0.3rem;
  font-size: 140%;
  background-color: var(--color2);
}
th.time.ok {
  color: darkgreen;
  transition: 1s;
}

input.seconds {
  width: 5rem;
  height: 1.5rem;
  background: #fff9d6;
  border: none;
  text-align: right;
  font-size: 130%;
}

.stage.dq,
.stage.dq tr,
.stage.dq th,
.stage.dq td,
.stage.dq td input {
  background-color: #c7c7c7;
}
</style>
