<script setup lang="ts">
// Background photos:
// https://www.flickr.com/photos/30478819@N08/44723128954
// https://commons.wikimedia.org/wiki/File:200909-F-NS874-1163_-_7th_SFG_Soldiers_conduct_Best_ODA_Competition_(Image_12_of_13).jpg

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScoresStore } from '@/stores/scores'
import { StageStatus, SraShootingTest } from '@/classes/SraShootingTest'
import { MapPin, Calendar, User, CardShield, Phone, ShareAndroid } from '@iconoir/vue'
import { PdfReport } from '@/classes/PdfReport'
import { shareLink, shareData } from '@/classes/Util'

const scoresStore = useScoresStore()
const { t } = useI18n()

const newShooterName = ref('')
// Open in edit mode when the list is empty.
const editMode = ref(Object.keys(scoresStore.scores).length < 1)
const toggleTestEventDetails = ref(false)

const firstName = (full: string) => full.split(' ')[0]

const addShooter = (name: string) => {
  const trimmed = name.trim()
  if (!trimmed) return

  if (scoresStore.scores[trimmed] !== undefined) {
    console.warn(t('resultList.warnDuplicateShooter', { name: trimmed }))
    return
  }

  const onlyFirstName = !trimmed.includes(' ')
  const firstNameClash = Object.keys(scoresStore.scores).some(
    (it) => firstName(it) === firstName(trimmed)
  )
  if (onlyFirstName && firstNameClash) {
    console.warn(t('resultList.warnDuplicateFirstName', { name: firstName(trimmed) }))
    return
  }

  scoresStore.addShooter(trimmed)
  newShooterName.value = ''
}

const formatHitFactor = (hf: number) =>
  hf == null || isNaN(hf) ? '' : `(${hf.toFixed(2)})`

type ResultKey = 'failed' | 'in-progress' | 'passed'

const resultStatus = (shooter: string): ResultKey => {
  if (shooter in scoresStore.disqualifications) return 'failed'
  if (!scoresStore.getAllStagesCompleted(shooter)) return 'in-progress'
  return scoresStore.getShooterHitFactor(shooter) >= SraShootingTest.requiredHitFactor
    ? 'passed'
    : 'failed'
}

const resultText = (shooter: string) => {
  switch (resultStatus(shooter)) {
    case 'failed': return t('result.failed')
    case 'in-progress': return t('result.inProgress')
    case 'passed': return t('result.passed')
  }
}

const stageDotClass = (status: StageStatus) => {
  switch (status) {
    case StageStatus.InProgress: return 'incomplete'
    case StageStatus.NotStarted: return 'notdone'
    case StageStatus.Completed: return 'done'
  }
}

const confirmRemove = (shooter: string) => {
  if (confirm(t('resultList.confirmRemoveShooter', { shooter }))) {
    scoresStore.removeShooter(shooter)
  }
}

// Show test event details when the user has expanded them or any field has a value.
const showTestEventDetails = () =>
  toggleTestEventDetails.value
  || !!scoresStore.referee_name
  || !!scoresStore.referee_sraid
  || !!scoresStore.referee_phone
  || !!scoresStore.testEvent_place
  || !!scoresStore.testEvent_date

const reset = () => {
  if (confirm(t('resultList.confirmReset'))) {
    scoresStore.reset()
  }
}
</script>

<template>
  <main :class="{ 'edit-mode': !editMode }">
    <div class="content">

      <div class="intro" v-if="editMode">{{ t('resultList.intro') }}</div>

      <h2>{{ editMode ? t('resultList.shooters') : t('resultList.title') }}</h2>

      <ul v-if="editMode" class="shooters">
        <li v-for="(_, shooter) in scoresStore.scores" :key="shooter">
          <a :href="'shooter/' + shooter"><span class="shooter">{{ shooter }}</span></a>
          <span @click="confirmRemove(shooter as string)" class="remove">⨉</span>
        </li>
      </ul>

      <table id="result-list" cellspacing="0" v-if="!editMode">
        <thead>
          <tr>
            <th class="name">{{ t('resultList.columnName') }}</th>
            <th class="stage-dots">{{ t('resultList.columnStages') }}</th>
            <th class="hit-factor">{{ t('resultList.columnResultAndHf') }}</th>
            <th class="result">{{ t('resultList.columnReport') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(_, shooter) in scoresStore.scores"
            :key="shooter"
            :class="{ dq: scoresStore.isDisqualified(shooter as string) }"
          >
            <td class="name">
              <a :href="'shooter/' + shooter"><span>{{ shooter }}</span></a>
            </td>
            <td class="stage-dots">
              <div
                v-for="stage in [0, 1, 2, 3, 4]"
                :key="stage"
                class="stage-dot"
                :class="stageDotClass(scoresStore.getStageStatus(shooter as string, stage))"
              >
                <a :href="'entry/' + stage + '/' + shooter">{{ stage + 1 }}</a>
              </div>
            </td>
            <td>
              <span id="result" :class="resultStatus(shooter as string)">
                {{ resultText(shooter as string) }}
              </span>
              {{ formatHitFactor(scoresStore.getShooterHitFactor(shooter as string)) }}
            </td>
            <td class="result-buttons">
              <button @click="new PdfReport().createPdf(shooter as string, scoresStore)">PDF</button>
              <a :href="shareLink(shareData(shooter as string, scoresStore))"><ShareAndroid /></a>
            </td>
          </tr>
        </tbody>
      </table>

      <fieldset v-if="editMode">
        <legend>{{ t('resultList.addShooter') }}</legend>
        <input
          id="new-name"
          name="new-name"
          v-model="newShooterName"
          :placeholder="t('resultList.namePlaceholder')"
          @keyup.enter="addShooter(newShooterName)"
        />
        <button
          class="action"
          @click="addShooter(newShooterName); scoresStore.safetyTrainingCompleted = false"
        >
          {{ t('resultList.add') }}
        </button>
      </fieldset>

      <fieldset v-if="editMode">
        <legend>{{ t('resultList.shootingOrder') }}</legend>
        <input type="radio" id="rotating-order" name="shooting-order" v-model="scoresStore.order" value="rotating" checked />
        <label for="rotating-order">{{ t('resultList.rotatingOrder') }}</label>
        <input type="radio" id="fixed-order" name="shooting-order" v-model="scoresStore.order" value="fixed" />
        <label for="fixed-order">{{ t('resultList.fixedOrder') }}</label>
      </fieldset>

      <div v-if="editMode" @click="toggleTestEventDetails = !toggleTestEventDetails" class="accordion-header">
        <h3>{{ t('resultList.testEvent') }}</h3>
      </div>

      <div v-if="showTestEventDetails()" class="accordion-content">
        <fieldset>
          <legend>{{ t('resultList.placeAndTime') }}</legend>
          <div>
            <div v-if="editMode || scoresStore.testEvent_place">
              <MapPin />
              <input id="test-event-place" v-model="scoresStore.testEvent_place" :placeholder="t('resultList.placePlaceholder')" :readonly="!editMode" />
            </div>
            <div v-if="editMode || scoresStore.testEvent_date">
              <Calendar />
              <input id="test-event-date" v-model="scoresStore.testEvent_date" type="date" :readonly="!editMode" />
            </div>
          </div>
        </fieldset>

        <fieldset v-if="editMode || scoresStore.referee_name">
          <legend>{{ t('resultList.receivingReferee') }}</legend>
          <div>
            <div v-if="editMode || scoresStore.referee_name">
              <User />
              <input id="referee-name" v-model="scoresStore.referee_name" :placeholder="t('resultList.namePlaceholderReferee')" :readonly="!editMode" />
            </div>
            <div v-if="editMode || scoresStore.referee_sraid">
              <CardShield />
              <input v-model="scoresStore.referee_sraid" :placeholder="t('resultList.sraIdPlaceholder')" :readonly="!editMode" />
            </div>
            <div v-if="editMode || scoresStore.referee_phone">
              <Phone />
              <input v-model="scoresStore.referee_phone" :placeholder="t('resultList.phonePlaceholder')" :readonly="!editMode" />
            </div>
          </div>
        </fieldset>
      </div>

      <div class="actions">
        <button v-if="editMode && Object.keys(scoresStore.scores).length > 0" class="action danger" @click="reset()">
          {{ t('resultList.removeAll') }}
        </button>
        <button v-if="editMode && Object.keys(scoresStore.scores).length > 1" class="action" @click="scoresStore.randomizeOrder()">
          {{ t('resultList.randomize') }}
        </button>
        <button v-if="Object.keys(scoresStore.scores).length > 0 && !editMode" class="action" @click="editMode = true">
          {{ t('resultList.editInfo') }}
        </button>
        <button
          v-if="Object.keys(scoresStore.scores).length > 0 && editMode"
          class="action"
          @click="scoresStore.safetyTrainingCompleted ? (editMode = false) : $router.push('safety')"
        >
          {{ t('resultList.continue') }}
        </button>
        <button
          v-if="!editMode && scoresStore.safetyTrainingCompleted"
          class="action"
          @click="$router.push('entry/0/' + Object.keys(scoresStore.scores)[0])"
        >
          {{ t('resultList.startTest') }}
        </button>
      </div>

    </div>
  </main>
</template>

<style scoped>
.accordion-header {
  cursor: pointer;
}

main {
  background-image:
    linear-gradient(to bottom, rgba(233, 233, 233, 0.2), rgba(233, 233, 233, 1)),
    url('../assets/tausta.jpg');
  background-repeat: no-repeat;
  padding: 9rem 0 0 0;

  &.edit-mode {
    padding: 0;
  }
}

.content {
  background-color: rgba(233, 233, 233, 0.7);
  padding: 1rem;
  line-height: 1.5;
}

table#result-list {
  border-radius: 0.3rem;
  width: 100%;

  & tr {
    height: 3rem;

    &:nth-child(odd) { background-color: #f5f5f5; }
    &:nth-child(even) { background-color: #e7e7e7; }

    & td { text-align: center; }

    & td.name {
      text-align: left;
      padding-left: 0.5rem;

      & a {
        color: #333;
        display: flex;

        & span {
          margin-left: 0.4rem;
          font-weight: bold;
        }
      }
    }

    & td.result-buttons a {
      vertical-align: middle;
      margin-left: 0.3em;
      display: inline-flex;
      color: #444;
    }

    & th {
      word-wrap: anywhere;
      font-size: 105%;
      background-color: #ececec;
      border-bottom: 2px solid #145014;
      color: var(--color1);
      font-weight: bold;
    }

    & th.stage-dots,
    & th.result {
      min-width: 6rem;
    }

    &.dq div.stage-dot {
      background-color: #ccc;
      & a { color: #333; }
    }
  }
}

.stage-dots .stage-dot:first-child {
  border-bottom-left-radius: 40%;
  border-top-left-radius: 40%;
}
.stage-dots .stage-dot:last-child {
  border-top-right-radius: 40%;
  border-bottom-right-radius: 40%;
}

.stage-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  font-size: 70%;

  & a { font-weight: bold; }

  &.done {
    background-color: var(--color1);
    & a { color: rgba(255, 255, 255, 0.8); }
  }
  &.notdone {
    background-color: var(--color2);
    & a { color: var(--color1); }
  }
  &.incomplete {
    background-color: #dea187;
    & a { color: var(--color1); }
  }
}

.shooters {
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;

  & li {
    display: flex;
    margin: 0.1rem;

    & a {
      color: #f1f1f1;
      display: flex;
    }

    .shooter {
      background-color: var(--color1);
      align-content: center;
      height: 1.7rem;
      padding: 0 0.1rem 0 1rem;
      border-radius: 0.8rem 0 0 0.8rem;
    }

    .remove {
      background-color: var(--color1);
      border-radius: 0 0.8rem 0.8rem 0;
      padding: 0 0.7rem 0.15rem 0.6rem;
      height: 1.7rem;
      font-size: 70%;
      align-content: center;
      color: #dddddd;

      &:hover {
        color: white;
        background-color: maroon;
      }
    }
  }
}

fieldset {
  margin: 0.1rem 0 0.5rem;
  display: flex;
  justify-content: space-between;

  & div div {
    display: flex;
    margin: 0.2rem 0;

    & input { margin-left: 0.5rem; }
  }
}

input:read-only {
  background-color: #eee;
  border: none;
}
</style>
