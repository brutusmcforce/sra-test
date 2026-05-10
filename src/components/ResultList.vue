<script setup lang="ts">

// https://www.flickr.com/photos/30478819@N08/44723128954
// https://commons.wikimedia.org/wiki/File:200909-F-NS874-1163_-_7th_SFG_Soldiers_conduct_Best_ODA_Competition_(Image_12_of_13).jpg

import { useScoresStore } from '@/stores/scores'
import { ref } from "vue"
import { StageStatus, SraShootingTest } from "@/classes/SraShootingTest"
import { MapPin, Calendar, User, CardShield, Phone, ShareAndroid  } from '@iconoir/vue'
import { PdfReport } from "@/classes/PdfReport"
import { shareLink, shareData } from "@/classes/Util";

const scoresStore = useScoresStore()

let newShooterName = ref('')

// Show shooter list in edit mode immediately if list is empty
let editMode = ref(Object.keys(scoresStore.scores).length < 1)

let toggleTestEventDetails = ref(false)

const addShooter = (name: string) => {
  if (name == null || name == '') {
    return
  }
  const addedFirstName = name.split(' ')[0]
  const anotherHasSameFirstName = Object.keys(scoresStore.scores).map((it) => it.split(' ')[0]).filter(x => x === addedFirstName).length > 0
  if (scoresStore.scores[name] !== undefined) {
    console.warn("Ampuja nimellä " + name + " on jo listalla.")
    return
  }
  if (anotherHasSameFirstName && name.split(' ').length == 1) {
    console.warn("Ampuja etunimellä " + addedFirstName + " on jo listalla. Lisää sukunimi.")
    return
  }
  scoresStore.addShooter(name)
  newShooterName.value = ''
}

const formatHitFactor = (hitFactor: number) => {
  if (hitFactor == null || isNaN(hitFactor)) {
    return ""
  }
  else {
    return "(" + hitFactor.toFixed(2) + ")"
  }
}

const formatResult = (allStagesCompleted: boolean, hitFactor: number, shooter: string) => {
  if (shooter in scoresStore.disqualifications) {
    return "HYLÄTTY"
  }

  if (!allStagesCompleted) {
    return "KESKEN"
  }
  if (hitFactor >= SraShootingTest.requiredHitFactor) {
    return "HYVÄKSYTTY"
  }
  return "HYLÄTTY"
}

const mapClass = (status: StageStatus) => {
  switch (status) {
    case StageStatus.InProgress:
      return 'incomplete'
    case StageStatus.NotStarted:
      return 'notdone'
    case StageStatus.Completed:
      return 'done'
  }
}

const confirmRemove = (shooter: string) => {
  if (confirm(`Poista ampujan ${shooter} tulostiedot?`)) {
    scoresStore.removeShooter(shooter)
  }
}

/**
 * Shows test event details if the user has clicked them visible or if any detail has been entered.
 */
function showTestEventDetails(): boolean {
  return toggleTestEventDetails.value  || scoresStore.referee_name != '' || scoresStore.referee_sraid != ''
      || scoresStore.referee_phone != '' || scoresStore.testEvent_place != ''
      || scoresStore.testEvent_date != ''
}

const reset = () => {
  if (confirm("Haluatko todella tyhjentää listan ja poistaa kaikki tulokset?")) {
    scoresStore.reset()
  }
}

// Auto-populate shooters during development
// onMounted(() => {
//   addShooter('Katriina')
//   addShooter('Maija')
//   addShooter('Heidi')
//   addShooter('Tiina')
// })

</script>

<template>
  <main v-bind:class="{ 'edit-mode': !editMode }">

    <div class="content">

      <div class="intro" v-if="editMode">
        Tervetuloa SRA ampumakokeeseen. Syötä ampumakokeeseen ostallistuvien henkilöiden nimet alla. Sovellukseen
        kirjatut tiedot tallentuvat ainoastaan päätelaitteen muistiin. Tietoja ei tallenneta ja jaeta verkossa. Voit
        ladata PDF-muotoiset tulospöytäkirjat tuloksien kirjaamisen jälkeen.
      </div>

      <h2 v-if="editMode">Ampujat</h2>
      <h2 v-if="!editMode">Tuloslista</h2>

      <ul v-if="editMode" class="shooters">
        <li v-bind:key="shooter" v-for="(shooterScores, shooter) in scoresStore.scores">
          <a :href="'shooter/' + shooter"><span class="shooter">{{ shooter }}</span></a>
          <span @click="confirmRemove(shooter as string)" class="remove">⨉</span></li>
      </ul>

      <table id="result-list" cellspacing="0" v-if="!editMode">
        <thead>
        <tr>
          <th class="name">Nimi</th>
          <th class="stage-dots">Rastit</th>
          <th class="hit-factor">Tulos ja HF</th>
          <th class="result">Pöytäkirja</th>
          <th v-if="editMode">Poista</th>
        </tr>
        </thead>
        <tbody>
        <tr v-bind:key="shooter" v-for="(shooterScores, shooter) in scoresStore.scores" v-bind:class="{dq: scoresStore.getDisqualificationReason(shooter as string) }">
          <td class="name">
            <a :href="'shooter/' + shooter"><span>{{ shooter }}</span></a>
          </td>
          <td class="stage-dots">
            <div v-bind:key="stage" class="stage-dot" v-bind:class="mapClass(scoresStore.getStageStatus(shooter as string, stage))"  v-for="stage in [0,1,2,3,4]">
              <a :href="'entry/' + stage + '/' + shooter">{{ stage+1 }}</a></div>
          </td>
          <td>
          <span id="result" v-bind:class="formatResult(scoresStore.getAllStagesCompleted(shooter as string), scoresStore.getShooterHitFactor(shooter as string), shooter as string)">
          {{
              formatResult(scoresStore.getAllStagesCompleted(shooter as string), scoresStore.getShooterHitFactor(shooter as string), shooter as string)
            }}
          </span>
            {{ formatHitFactor(scoresStore.getShooterHitFactor(shooter as string)) }}
          </td>

          <td class="result-buttons"><button @click="(new PdfReport()).createPdf(shooter as string, scoresStore)">PDF</button> <a :href="shareLink(shareData(shooter, scoresStore))"><ShareAndroid/> </a></td>

          <td v-if="editMode"><button class="danger" @click="confirmRemove(shooter as string)">🗑 POISTA</button></td>
        </tr>
        </tbody>
      </table>

      <fieldset v-if="editMode" >
        <legend>Lisää ampuja</legend>
        <input placeholder="Ampujan nimi" id="new-name" name="new-name" v-model="newShooterName" v-on:keyup.enter="addShooter(newShooterName)"/>
        <button class="action" value="Lisää" @click="addShooter(newShooterName);scoresStore.safetyTrainingCompleted = false;">Lisää</button>
      </fieldset>


      <fieldset v-if="editMode">
        <legend>Kokeen ampumajärjestys</legend>
        <input type="radio" id="rotating-order" name="shooting-order" v-model="scoresStore.order" value="rotating" checked />
        <label for="rotating-order">Kiertävä järjestys: ensimmäisenä ampunut siirtyy seuraavalla rastilla viimeiseksi</label>
        <input type="radio" id="fixed-order" name="shooting-order" v-model="scoresStore.order" value="fixed" />
        <label for="fixed-order">Sama järjestys joka rastilla</label>
      </fieldset>

      <div>
        <div v-if="editMode" @click="toggleTestEventDetails = !toggleTestEventDetails" class="accordion-header">
          <h3>Koetilaisuus »</h3>
        </div>
      </div>

      <div v-if="showTestEventDetails()" class="accordion-content">

        <fieldset v-if="editMode || scoresStore.testEvent_place != '' || scoresStore.testEvent_date != ''">
          <legend>Paikka ja aika</legend>
          <div>
            <div v-if="editMode || scoresStore.testEvent_place != ''">
              <MapPin/><input id="test-event-place" v-model="scoresStore.testEvent_place" placeholder="Paikka" :readonly="!editMode"/>
            </div>
            <div v-if="editMode || scoresStore.testEvent_date != ''">
              <Calendar/><input id="test-event-date" v-model="scoresStore.testEvent_date" type="date" :readonly="!editMode"/>
            </div>
          </div>
        </fieldset>

        <fieldset v-if="editMode || scoresStore.referee_name !==''">
          <legend>Vastaanottava tuomari</legend>
          <div>
            <div v-if="editMode || scoresStore.referee_name !==''">
              <User/><input id="referee-name" v-model="scoresStore.referee_name" placeholder="Nimi" :readonly="!editMode"/>
            </div>
            <div v-if="editMode || scoresStore.referee_sraid !==''">
              <CardShield/><input v-model="scoresStore.referee_sraid" placeholder="SRA ID" :readonly="!editMode"/>
            </div>
            <div v-if="editMode || scoresStore.referee_phone !==''">
              <Phone/><input v-model="scoresStore.referee_phone" placeholder="Puhelin" :readonly="!editMode"/>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="actions">
        <button class="action danger" v-if="editMode && Object.keys(scoresStore.scores).length > 0" @click="reset()">Poista kaikki ampujat</button>
        <button v-if="editMode && Object.keys(scoresStore.scores).length > 1" @click="scoresStore.randomizeOrder()" class="action">⤭ Järjestä satunnaisesti</button>
        <button class="action" v-if="Object.keys(scoresStore.scores).length > 0 && !editMode" @click="editMode = !editMode">Muokkaa tietoja</button>
        <button class="action" v-if="Object.keys(scoresStore.scores).length > 0 && editMode && scoresStore.safetyTrainingCompleted" @click="editMode = !editMode">Jatka</button>
        <button class="action" v-if="Object.keys(scoresStore.scores).length > 0 && editMode && scoresStore.safetyTrainingCompleted == false" @click="$router.push('safety')">Jatka</button>

        <button v-if="!editMode && scoresStore.safetyTrainingCompleted" class="action" @click="$router.push('entry/0/' + Object.keys(scoresStore.scores)[0])">Aloita ampumakoe</button>
      </div>

    </div>
  </main>
</template>
<style scoped>

body {
  background-color: red;
}

main {
  background-image: linear-gradient(to bottom, rgba(233, 233, 233, .2), rgba(233, 233, 233, 1)), url("../assets/tausta.jpg");
  background-repeat: no-repeat;
  padding: 9rem 0 0 0;

  &.edit-mode {
    padding: 0 0 0 0;
  }
}

.content {
  background-color: rgba(233,233,233, .7);
  padding: 1rem;
  line-height: 1.5;
}


table#result-list {
  border-radius: .3rem;
  width: 100%;


  & tr {

    height: 3rem;

    &:nth-child(odd) {
      background-color: #f5f5f5;
    }
    &:nth-child(even) {
      background-color: #e7e7e7;
    }

    & td {
      text-align: center;
    }

    & td.name {
      text-align: left;
      padding-left: .5rem;

      & a {
        color: #333;
        display: flex;

        & span {
          margin-left: .4rem;
          font-weight: bold;
        }
      }
    }

    & td.result-buttons {
      & a {
        vertical-align: middle;
        margin-left: .3em;
        display: inline-flex;
        color: #444;
      }
    }

    & th {
      word-wrap: anywhere;
      font-size: 105%;
      background-color: #ececec;
      border-bottom: 2px solid #145014;
      color: var(--color1);
      font-weight: bold;

      &.stage-dots {
        min-width: 6rem;
      }
      &.result
      {
        min-width: 6rem;
      }
    }

    &.dq {
      & div.stage-dot {
        background-color: #ccc;
        & a {
          color: #333;
        }
      }
    }
  }
}

.stage-dots {
  .stage-dot:first-child {
    border-bottom-left-radius: 40%;
    border-top-left-radius: 40%;
  }
  .stage-dot:last-child {
    border-top-right-radius: 40%;
    border-bottom-right-radius: 40%;
  }
}

.stage-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  margin: 0;
  font-size: 70%;

  &.done {
    background-color: var(--color1);
    & a {
      color: rgba(255, 255, 255, 0.8);
      font-weight: bold;
    }
  }
  &.notdone {
    background-color: var(--color2);
    & a {
      color: var(--color1);
      font-weight: bold;
    }
  }
  &.incomplete {
    background-color: #dea187;
    & a {
      color: var(--color1);
      font-weight: bold;
    }
  }

}

.shooters {

  padding: .5rem 0 .5rem 0;
  display: flex;
  flex-wrap: wrap;

  & li {
    display: flex;
    margin: .1rem;

    & a {
    color: #f1f1f1;
    display: flex;
    }


    .remove {
      background-color: var(--color1);
      border-radius: 0 .8rem .8rem 0;
      padding: 0 .7rem .15rem .6rem;
      height: 1.7rem;
      font-size: 70%;
      align-content: center;
      color: #dddddd;

      &:hover {
        color: white;
        background-color: maroon;
      }
    }

    .shooter {
      background-color: var(--color1);
      align-content: center;
      height: 1.7rem;
      padding: 0 .1rem 0 1rem;
      border-radius: .8rem 0 0 .8rem;
    }
  }
}

fieldset {
  margin: .1rem 0 .5rem 0;
  display: flex;
  justify-content: space-between;

  & div div {
    display: flex;
    margin: .2rem 0 .2rem 0;

    & input {
      margin-left: .5rem;
    }
  }
}

input:read-only {
  background-color: #eee;
  border: none;
}

</style>
