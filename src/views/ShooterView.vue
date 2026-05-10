<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Prohibition, Undo, User } from '@iconoir/vue'
import { useScoresStore } from '@/stores/scores'
import { PdfReport } from '@/classes/PdfReport'
import {
  recordDisqualification,
  cancelDisqualification,
  shareData,
  encodeData,
} from '@/classes/Util'

const route = useRoute()
const { t } = useI18n()
const scoresStore = useScoresStore()

const shooter = (route.params.shooter as string) ?? null

const onRecordDq = () => {
  if (shooter) {
    recordDisqualification(scoresStore, shooter, t('shooter.dqPrompt', { shooter }))
  }
}

const onCancelDq = () => {
  if (shooter) cancelDisqualification(scoresStore, shooter)
}

const onPdf = () => {
  if (shooter) new PdfReport().createPdf(shooter, scoresStore, '../')
}

const onBirthDate = (e: Event) =>
  scoresStore.setBirthDate(shooter, (e.target as HTMLInputElement).value)
const onCourseNumber = (e: Event) =>
  scoresStore.setCourseNumber(shooter, (e.target as HTMLInputElement).value)
const onClub = (e: Event) =>
  scoresStore.setClub(shooter, (e.target as HTMLInputElement).value)
</script>

<template>
  <main v-if="shooter">
    <div class="main">

      <div class="name-card">
        <User width="4rem" height="4rem" color="#888" />
        <h1>{{ shooter }}</h1>
      </div>

      <p>{{ t('shooter.pdfHint') }}</p>

      <table class="course-info">
        <tbody>
          <tr>
            <th>{{ t('shooter.birthDate') }}</th>
            <td><input type="date" :value="scoresStore.birthDates[shooter]" @change="onBirthDate" /></td>
          </tr>
          <tr>
            <th>{{ t('shooter.courseNumber') }}</th>
            <td><input :value="scoresStore.courseNumbers[shooter]" @change="onCourseNumber" /></td>
          </tr>
          <tr>
            <th>{{ t('shooter.club') }}</th>
            <td><input :value="scoresStore.clubs[shooter]" @change="onClub" /></td>
          </tr>
        </tbody>
      </table>

      <div v-if="scoresStore.disqualifications[shooter] != null" class="dq-reason">
        {{ t('shooter.disqualificationReason') }} {{ scoresStore.disqualifications[shooter] }}
      </div>

      <div class="score-card-link">
        <a :href="'../result?d=' + encodeData(shareData(shooter, scoresStore))">
          {{ t('shooter.scoreCardLink') }}
        </a>
      </div>

      <div class="actions">
        <button v-if="!(shooter in scoresStore.disqualifications)" class="action dq" @click="onRecordDq">
          <Prohibition /> {{ t('shooter.recordDq') }}
        </button>
        <button v-else class="action" @click="onCancelDq">
          <Undo /> {{ t('shooter.cancelDq') }}
        </button>
        <button class="action" @click="onPdf">{{ t('shooter.pdfReport') }}</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.course-info {
  margin-top: 1rem;

  & th { font-size: 100%; }
}

.dq-reason {
  margin: 1rem;
  color: darkred;
}

.score-card-link {
  text-align: right;

  & a { color: black; }
}
</style>
