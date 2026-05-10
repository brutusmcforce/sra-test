<script setup lang="ts">
import {useScoresStore} from '@/stores/scores'
import {useRoute} from 'vue-router'
import {Prohibition, Undo, User} from '@iconoir/vue';
import {PdfReport} from "@/classes/PdfReport";
import {recordDisqualification, cancelDisqualification, shareData, encodeData} from "@/classes/Util";
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const scoresStore = useScoresStore()

let shooter : string = (route.params.shooter) ? route.params.shooter as string : null

const onRecordDq = () => {
  recordDisqualification(scoresStore, shooter, t('shooter.dqPrompt', { shooter }))
}

</script>

<template>

  <main>

    <div class="main">

      <div class="name-card">
        <User width="4rem" height="4rem" color="#888"/><h1>{{ shooter }}</h1>
      </div>

      <p>{{ t('shooter.pdfHint') }}</p>

      <table class="course-info" v-if="shooter != null">
        <tbody>
        <tr>
          <th>{{ t('shooter.birthDate') }}</th>
          <td><input type="date" :value="scoresStore.birthDates[shooter]" @change="event => scoresStore.setBirthDate(shooter, (event.target as HTMLInputElement).value as any)" /></td>
        </tr>
        <tr>
          <th>{{ t('shooter.courseNumber') }}</th>
          <td><input :value="scoresStore.courseNumbers[shooter]" @change="event => scoresStore.setCourseNumber(shooter, (event.target as HTMLInputElement).value)"/></td>
        </tr>
        <tr>
          <th>{{ t('shooter.club') }}</th>
          <td><input :value="scoresStore.clubs[shooter]" @change="event => scoresStore.setClub(shooter, (event.target as HTMLInputElement).value)"/></td>
        </tr>
        </tbody>
      </table>


      <div v-if="scoresStore.disqualifications[shooter] != null" class="dq-reason">
        {{ t('shooter.disqualificationReason') }}
        {{ scoresStore.disqualifications[shooter] }}
      </div>

      <div class="score-card-link">
        <a :href="'../result?d=' + encodeData(shareData(shooter as string, scoresStore))">
        {{ t('shooter.scoreCardLink') }}
        </a>
      </div>

      <div class="actions">
        <button v-if="!(shooter in scoresStore.disqualifications)" class="action dq" @click="onRecordDq"><Prohibition/> {{ t('shooter.recordDq') }}</button>
        <button v-else @click="cancelDisqualification(scoresStore, shooter as string)" class="action"><Undo/> {{ t('shooter.cancelDq') }}</button>
        <button class="action" v-if="shooter != null" @click="(new PdfReport()).createPdf(shooter as string, scoresStore, '../')">{{ t('shooter.pdfReport') }}</button>
      </div>
    </div>

  </main>

</template>

<style>

.course-info {
  margin-top: 1rem;
}

</style>
