<script setup lang="ts">
import {useScoresStore} from '@/stores/scores'
import {useRoute} from 'vue-router'
import {Prohibition, Undo, User} from '@iconoir/vue';
import {PdfReport} from "@/classes/PdfReport";
import {recordDisqualification, cancelDisqualification, shareData, encodeData} from "@/classes/Util";

const route = useRoute()

const scoresStore = useScoresStore()

let shooter : string = (route.params.shooter) ? route.params.shooter as string : null

</script>

<template>

  <main>

    <div class="main">

      <div class="name-card">
        <User width="4rem" height="4rem" color="#888"/><h1>{{ shooter }}</h1>
      </div>

      <p>Koetuloksen PDF-pöytäkrijalle tulostettavat (valinnaiset) lisätiedot.</p>

      <table class="course-info" v-if="shooter != null">
        <tbody>
        <tr>
          <th>Syntymäaika</th>
          <td><input type="date" :value="scoresStore.birthDates[shooter]" @change="event => scoresStore.setBirthDate(shooter, event.target.value)" /></td>
        </tr>
        <tr>
          <th>SRA kurssin numero tai muu tunniste</th>
          <td><input :value="scoresStore.courseNumbers[shooter]" @change="event => scoresStore.setCourseNumber(shooter, event.target.value)"/></td>
        </tr>
        <tr>
          <th>RU/RES/MPKL yhdistys</th>
          <td><input :value="scoresStore.clubs[shooter]" @change="event => scoresStore.setClub(shooter, event.target.value)"/></td>
        </tr>
        </tbody>
      </table>


      <div v-if="scoresStore.disqualifications[shooter] != null" class="dq-reason">
        Hylkäyksen syy:
        {{ scoresStore.disqualifications[shooter] }}
      </div>

      <div class="score-card-link">
        <a :href="'../result?d=' + encodeData(shareData(shooter as string, scoresStore))">
        Tuloskortti »
        </a>
      </div>

      <div class="actions">
        <button v-if="!(shooter in scoresStore.disqualifications)" class="action dq" @click="recordDisqualification(scoresStore, shooter)"><Prohibition/> Kirjaa hylkäys</button>
        <button v-else @click="cancelDisqualification(scoresStore, shooter as string)" class="action"><Undo/> Peru hylkäys</button>
        <button class="action" v-if="shooter != null" @click="(new PdfReport()).createPdf(shooter as string, scoresStore, '../')">PDF-pöytäkirja</button>
      </div>
    </div>

  </main>

</template>

<style>

.course-info {
  margin-top: 1rem;
}

</style>
