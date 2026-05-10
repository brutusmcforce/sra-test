<script setup lang="ts">
import { ref, watch } from "vue";
import { StageStatus, SraShootingTest } from "@/classes/SraShootingTest";
import { useScoresStore } from "@/stores/scores";
import { useRoute } from "vue-router";
import StageScoreRow from "@/components/StageScoreRow.vue";
import {
  Clock,
  Check,
  SoundLow,
  SoundOff,
  InfoCircle,
  Prohibition,
  Undo,
} from "@iconoir/vue";
import { recordDisqualification, cancelDisqualification } from "@/classes/Util";
import { useI18n } from "vue-i18n";

const route = useRoute();
const scoresStore = useScoresStore();
const { t, tm } = useI18n();
const synth = window.speechSynthesis;

const showStageInfo = ref(false);

let shooter: string = route.params.shooter
  ? (route.params.shooter as string)
  : Object.keys(scoresStore.scores)[0];
let stage: number = route.params.stage
  ? (Number(route.params.stage) as number)
  : 0;

watch(
  () => route.params.shooter,
  () => {
    shooter = route.params.shooter as string;
  },
);

watch(
  () => route.params.stage,
  () => {
    stage = Number(route.params.stage) as number;
  },
);

function getImageUrl() {
  return new URL(`../assets/logo.svg`, import.meta.url).href;
}

const nextNonDisqualifiedShooter = (shooters: string[]) => {
  for (let nextCandidate of shooters) {
    if (!(nextCandidate in scoresStore.disqualifications)) {
      return nextCandidate;
    }
  }
  return null;
};

const previousNonDisqualifiedShooter = (shooters: string[]) => {
  return nextNonDisqualifiedShooter(shooters.reverse());
};

const nextLink = (stage: number, shooter: string) => {
  const nextShooter = stageNextShooter(stage, shooter);
  // Next stage
  if (nextShooter == null) {
    if (stage == 4) {
      return "/";
    } else {
      return (
        "/entry/" +
        (stage + 1) +
        "/" +
        rotateOrder(Object.keys(scoresStore.scores), stage + 1)[0]
      );
    }
  } else {
    return "/entry/" + stage + "/" + nextShooter;
  }
};

const previousLink = (stage: number, shooter: string) => {
  const previousShooter = stagePreviousShooter(stage, shooter);
  // Previous stage
  if (previousShooter == null) {
    if (stage == 0) {
      return "/";
    } else {
      return (
        "/entry/" +
        (stage - 1) +
        "/" +
        rotateOrder(Object.keys(scoresStore.scores), stage - 1)
          .reverse()
          .find((t) => !(t in scoresStore.disqualifications))
      );
    }
  } else {
    return "/entry/" + stage + "/" + previousShooter;
  }
};

const stageNextShooter = (stage: number, shooter: string): string | null => {
  const stageShooterOrder: string[] = rotateOrder(
    Object.keys(scoresStore.scores),
    stage,
  );
  const stageRemainingShooters = stageShooterOrder.slice(
    stageShooterOrder.indexOf(shooter) + 1,
  );
  return nextNonDisqualifiedShooter(stageRemainingShooters);
};

const stagePreviousShooter = (
  stage: number,
  shooter: string,
): string | null => {
  const stageShooterOrder: string[] = rotateOrder(
    Object.keys(scoresStore.scores),
    stage,
  );
  const currentIndex = stageShooterOrder.indexOf(shooter);
  const stagePreviousShooters = stageShooterOrder.slice(0, currentIndex);
  return previousNonDisqualifiedShooter(stagePreviousShooters);
};

const instructionPhrase = (stage: number, shooter: string): string => {
  const nextShooter = stageNextShooter(stage, shooter);
  if (nextShooter == null) {
    if (stage < 4) {
      return t("scoring.shootingNextWithLast", { shooter });
    } else {
      return t("scoring.shootingNextFinal", { shooter });
    }
  } else {
    return t("scoring.shootingNextWithUpcoming", {
      shooter,
      next: nextShooter,
    });
  }
};

const rotateOrder = (shooters: string[], stage: number): string[] => {
  if (scoresStore.order !== "rotating") {
    return shooters;
  }
  for (let i = 0; i < stage; i++) {
    shooters.push(shooters.shift() as string);
  }
  return shooters;
};

const say = (s: string) => {
  if (scoresStore.mute === true) {
    return;
  }
  const utterThis = new SpeechSynthesisUtterance(s);
  utterThis.lang = t("voice.lang");
  synth.speak(utterThis);
};

const shortenName = (fullName: string) => {
  const allFirstNames = Object.keys(scoresStore.scores).map(
    (it) => it.split(" ")[0],
  );
  const allFirstNameAndInitial = Object.keys(scoresStore.scores).map((it) => {
    const otherShooterNames = it.split(" ");
    let ret = otherShooterNames[0];
    if (otherShooterNames.length > 1) {
      ret += " " + otherShooterNames[1].replace(/[a-z]/g, "");
    }
    return ret;
  });
  const names = fullName.split(" ");
  const firstName = names[0];

  let firstNameAndInitial = firstName;
  if (names.length > 1) {
    firstNameAndInitial += " " + names[1].replace(/[a-z]/g, "");
  }

  const anotherHasSameFirstName =
    allFirstNames.filter((x) => x === firstName).length > 1;
  const anotherHasSameInitial =
    allFirstNameAndInitial.filter((x) => x === firstNameAndInitial).length > 1;

  // No one else has the same first name
  if (!anotherHasSameFirstName) {
    return firstName;
  }
  // Someone else has the same first name, but the last-name initial differs
  else if (!anotherHasSameInitial && names.length > 1) {
    return firstName + " " + names[1].replace(/[a-z]/g, "");
  }
  // Another shooter has the same first name and the same last-name initial: show the full name for both
  return fullName;
};

const getClasses = (stage: number, currentShooter: string, aid: string) => {
  if (aid === currentShooter) {
    if (aid in scoresStore.disqualifications) {
      return "active dq";
    } else {
      return "active";
    }
  }
  if (aid in scoresStore.disqualifications) {
    return "inactive dq";
  }
  const status = scoresStore.getStageStatus(aid, stage);
  switch (status) {
    case StageStatus.InProgress:
      return "inactive incomplete";
    case StageStatus.NotStarted:
      return "inactive notdone";
    case StageStatus.Completed:
      return "inactive done";
  }
};

const stageHitFactor = (shooter: string, stage: number): number => {
  if (scoresStore.getStageStatus(shooter, stage) !== StageStatus.Completed) {
    return 0;
  }
  const points = scoresStore.getShooterStagePointSum(shooter, stage);
  const time = scoresStore.getShooterStageTime(shooter, stage);
  return points / time;
};

const stageClasses = (currentStage: number, s: number) => {
  if (s == currentStage) {
    return "active";
  }
  const shooters = Object.keys(scoresStore.scores).filter(
    (sh) => !(sh in scoresStore.disqualifications),
  );
  if (
    shooters
      .map((sh) => scoresStore.getStageStatus(sh, s))
      .filter((t) => t == StageStatus.Completed).length == shooters.length
  ) {
    return "done";
  }
  return "todo";
};

const showDescription = (stage: number) => {
  const descriptions = tm("stages.description") as unknown as string[];
  return descriptions[stage];
};

const onRecordDq = () => {
  recordDisqualification(
    scoresStore,
    shooter,
    t("shooter.dqPrompt", { shooter }),
  );
};

const formatHitFactor = (hf: number): string => {
  if (hf === 0) {
    return "";
  }
  return "HF " + hf.toFixed(2);
};

/** Is the target's scoring complete for this shooter/stage entry? */
const targetScoringComplete = (
  shooter: string,
  stage: number,
  target: number,
) => {
  if (scoresStore.stage5Methods[shooter] == "kiv") {
    return (
      scoresStore.scores[shooter][stage].reduce(
        (acc, cur) => acc + Number(cur[target]),
        0,
      ) >= SraShootingTest.shotCountsWithRifle[stage][target]
    );
  } else {
    return (
      scoresStore.scores[shooter][stage].reduce(
        (acc, cur) => acc + Number(cur[target]),
        0,
      ) >= SraShootingTest.shotCountsWithPistol[stage][target]
    );
  }
};

/**
 * If more than two digits are entered into the time field, the last two digits are interpreted as hundredths
 * of a second and the preceding digits as whole seconds. This way "1398" (without a decimal point) can be entered
 * and it is interpreted correctly as "13.98 seconds".
 */
const parseEnteredTime = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;

  // Time was entered as xxxx.yy or fewer than 3 characters have been entered: don't insert a separator.
  if (
    inputElement.value.length < 3 ||
    inputElement.value.match(/^[0-9]{0,4}\.[0-9]{2}$/)
  ) {
    return;
  }

  // "1" --> "0.01"
  // "12" --> "0.12"
  // "123 --> "1.23"
  // "1234 --> "12.34"
  // "1028 --> "10.28"
  // "002003 --> "20.03"
  const onlyDigits = inputElement.value
    .replace(/[^0-9]/g, "")
    .replace(/^0+/, "")
    .padStart(3, "0");
  if (onlyDigits.length >= 2) {
    let seconds = onlyDigits.substring(0, onlyDigits.length - 2);
    let hundredths = onlyDigits.substring(
      onlyDigits.length - 2,
      onlyDigits.length,
    );
    inputElement.value = seconds + "." + hundredths;
    inputElement.dispatchEvent(new InputEvent("input"));
  }
};

/**
 * Check whether the shooting entry is complete: are the times saved and all hits scored?
 *
 * @param shooter
 * @param stage
 */
const confirmIncompleteEntry = (shooter: string, stage: number) => {
  if (
    // First time is missing (any stage)
    !(scoresStore.getShooterStageTimes(shooter, stage)[0] > 0) ||
    // Second time is missing (stages 1 and 2)
    ([0, 1].includes(stage) &&
      !(scoresStore.getShooterStageTimes(shooter, stage)[1] > 0)) ||
    // Third time is missing
    ([0, 1].includes(stage) &&
      !(scoresStore.getShooterStageTimes(shooter, stage)[2] > 0)) ||
    // First target's scoring is incomplete
    !targetScoringComplete(shooter, stage, 0) ||
    // Second target's scoring is incomplete
    !targetScoringComplete(shooter, stage, 1)
  ) {
    return confirm(t("scoring.confirmIncomplete"));
  } else {
    return true;
  }
};
</script>

<template>
  <main>
    <nav class="stages">
      <ul>
        <li
          :key="s"
          class="stage"
          v-for="s in [0, 1, 2, 3, 4]"
          v-bind:class="stageClasses(stage, s)"
        >
          <a class="stage" :href="'../../entry/' + s + '/' + shooter"
            >{{ t("scoring.stage") }} {{ s + 1 }}</a
          >
        </li>
      </ul>
    </nav>

    <nav class="shooters">
      <ul>
        <li
          class="shooter"
          :key="aid"
          v-for="aid in rotateOrder(Object.keys(scoresStore.scores), stage)"
          v-bind:class="getClasses(stage, shooter, aid)"
        >
          <a :href="'../../entry/' + stage + '/' + aid">{{
            shortenName(aid)
          }}</a>
        </li>
      </ul>
    </nav>

    <div class="main">
      <div
        class="instruction"
        v-if="!(shooter in scoresStore.disqualifications)"
      >
        "{{ instructionPhrase(stage, shooter) }}"
        <div class="speak" @click="say(instructionPhrase(stage, shooter))">
          🔊
        </div>
      </div>

      <div class="stage-header-bar">
        <h2 class="stage-header">
          {{ t("scoring.stageHeader", { stage: stage + 1, shooter }) }}
        </h2>
        <div
          class="result"
          v-bind:class="stageHitFactor(shooter, stage) >= 1.3 ? 'ok' : 'notok'"
        >
          {{ formatHitFactor(stageHitFactor(shooter, stage)) }}
        </div>
      </div>

      <fieldset v-if="stage === 4">
        <legend>{{ t("scoring.method") }}</legend>
        <div>
          <input
            type="radio"
            id="pist"
            value="pist"
            v-model="scoresStore.stage5Methods[shooter]"
          />
          <label for="pist">{{ t("scoring.pistol") }}</label>
          <input
            type="radio"
            id="kiv"
            value="kiv"
            v-model="scoresStore.stage5Methods[shooter]"
          />
          <label for="kiv">{{ t("scoring.rifle") }}</label>
        </div>
      </fieldset>

      <div class="actions">
        <button
          v-if="!(shooter in scoresStore.disqualifications)"
          class="action dq"
          @click="onRecordDq"
        >
          <Prohibition /> {{ t("scoring.recordDq") }}
        </button>
        <button
          v-else
          @click="cancelDisqualification(scoresStore, shooter as string)"
          class="action"
        >
          <Undo /> {{ t("scoring.cancelDq") }}
        </button>

        <button class="action" @click="showStageInfo = true">
          <InfoCircle /> {{ t("scoring.stageDescription") }}
        </button>

        <button
          v-if="scoresStore.mute === true"
          class="action"
          @click="scoresStore.mute = false"
        >
          <SoundLow /> {{ t("scoring.unmute") }}
        </button>
        <button
          v-if="scoresStore.mute === false"
          class="action"
          @click="scoresStore.mute = true"
        >
          <SoundOff /> {{ t("scoring.mute") }}
        </button>
      </div>

      <div class="stage-info-overlay" v-if="showStageInfo"></div>
      <div class="stage-info" v-if="showStageInfo">
        <h2>{{ t("scoring.stage") }} {{ stage + 1 }}</h2>

        <p>{{ showDescription(stage) }}</p>

        <div class="stage-info-button">
          <button class="close action" @click="showStageInfo = false">
            {{ t("scoring.close") }}
          </button>
        </div>
      </div>

      <table
        class="stage"
        :class="{ dq: shooter in scoresStore.disqualifications }"
      >
        <tbody>
          <tr>
            <th
              class="time"
              v-bind:class="
                scoresStore.getShooterStageTimes(shooter, stage)[0] > 0
                  ? 'ok'
                  : 'notok'
              "
            >
              <Check
                v-if="scoresStore.getShooterStageTimes(shooter, stage)[0] > 0"
                stroke-width="3"
                color="darkgreen"
              />
              <Clock v-else />
            </th>
            <td>
              <input
                id="time1"
                onfocus="this.select()"
                class="seconds"
                v-model="scoresStore.getShooterStageTimes(shooter, stage)[0]"
                type="number"
                @keyup="parseEnteredTime($event)"
                min="0.00"
                step="0.01"
                :disabled="shooter in scoresStore.disqualifications"
              />
            </td>
          </tr>
          <tr v-if="stage in [0, 1]">
            <th
              class="time"
              v-bind:class="
                scoresStore.getShooterStageTimes(shooter, stage)[1] > 0
                  ? 'ok'
                  : 'notok'
              "
            >
              <Check
                v-if="scoresStore.getShooterStageTimes(shooter, stage)[1] > 0"
                stroke-width="3"
                color="darkgreen"
              />
              <Clock v-else />
            </th>
            <td>
              <input
                id="time2"
                onfocus="this.select()"
                class="seconds"
                v-model="scoresStore.getShooterStageTimes(shooter, stage)[1]"
                type="number"
                @keyup="parseEnteredTime($event)"
                min="0.00"
                step="0.01"
                :disabled="shooter in scoresStore.disqualifications"
              />
            </td>
          </tr>
          <tr v-if="stage in [0, 1]">
            <th
              class="time"
              v-bind:class="
                scoresStore.getShooterStageTimes(shooter, stage)[2] > 0
                  ? 'ok'
                  : 'notok'
              "
            >
              <Check
                v-if="scoresStore.getShooterStageTimes(shooter, stage)[2] > 0"
                stroke-width="3"
                color="darkgreen"
              />
              <Clock v-else />
            </th>
            <td>
              <input
                id="time3"
                onfocus="this.select()"
                class="seconds"
                v-model="scoresStore.getShooterStageTimes(shooter, stage)[2]"
                type="number"
                @keyup="parseEnteredTime($event)"
                min="0.00"
                step="0.01"
                :disabled="shooter in scoresStore.disqualifications"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <table
        cellspacing="0"
        class="stage"
        :class="{ dq: shooter in scoresStore.disqualifications }"
      >
        <thead>
          <tr>
            <th class="hit-class"></th>
            <th
              class="target"
              v-bind:class="
                targetScoringComplete(shooter, stage, 0) ? 'ok' : 'notok'
              "
            >
              <span>
                <Check
                  v-if="targetScoringComplete(shooter, stage, 0)"
                  stroke-width="3"
                  color="darkgreen"
                />
                <span v-else>T1</span>
              </span>
            </th>
            <th
              class="target"
              v-bind:class="
                targetScoringComplete(shooter, stage, 1) ? 'ok' : 'notok'
              "
            >
              <span>
                <Check
                  v-if="targetScoringComplete(shooter, stage, 1)"
                  stroke-width="3"
                  color="darkgreen"
                />
                <span v-else>T1</span>
              </span>
            </th>
            <th class="hits">{{ t("scoring.hits") }}</th>
            <th class="points">{{ t("scoring.points") }}</th>
          </tr>
        </thead>
        <tbody>
          <StageScoreRow
            :key="idx"
            v-for="(hitClass, idx) in SraShootingTest.hitClasses"
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

      <div class="actions">
        <button
          class="action"
          @click="
            confirmIncompleteEntry(shooter, stage) &&
            $router.push(previousLink(stage, shooter))
          "
        >
          {{ t("scoring.previousShooter") }}
        </button>
        <button
          class="action"
          @click="
            confirmIncompleteEntry(shooter, stage) &&
            $router.push(nextLink(stage, shooter))
          "
        >
          {{ t("scoring.nextShooter") }}
        </button>
      </div>
    </div>
  </main>
</template>
<style>
.main {
  margin: 0 0.2rem 0 0.2rem;
}

label {
  padding-right: 2rem;
  padding-left: 0.5rem;
}

div.stage-info-overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
div.stage-info {
  position: relative;
  min-width: 300px;
  width: 80%;
  z-index: 9999;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #fff;
}

.stage-header-bar {
  display: flex;
  justify-content: space-between;
  vertical-align: center;
  align-content: center;

  .stage-header {
    color: #222;
  }

  .result {
    align-content: center;
    min-width: 4rem;
    padding: 0.3rem;
  }
  .result.ok {
    color: var(--color1);
  }
  .result.notok {
    color: #363636;
  }
}

.instruction {
  font-size: 1em;
  padding: 0.3rem;
  border-radius: 10px;
  background: #cadbe7;
  color: #224;
  width: 85%;
  position: relative;
  margin: 0.5rem auto;
  font-style: italic;
  text-align: center;
  border: 1px solid #cadbe7;
}

.instruction:after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 1.618em solid transparent;
  border-right-color: #cadbe7;
  border-left: 0;
  border-top: 0;
  margin-top: -0.809em;
  margin-left: -1.618em;
}

.action.result-list::before {
  content: "☰";
  font-size: 200%;
}

.speak {
  display: inline;
}

/** Shooters list in the scoring view */

.shooter.done {
  background-color: #8d8d8d;
  & a {
    color: var(--color2);
    font-size: 180%;
  }
  :before {
    content: "✔";
    color: transparent;
    text-shadow: 0 0 0 green;
    padding-right: 0.4rem;
  }
}

.shooter.notdone {
  background-color: var(--color2);
  & a {
    color: var(--color1);
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: "👤";
    color: transparent;
    text-shadow: 0 0 0 black;
    padding-right: 0.4rem;
  }
}

.shooter.incomplete {
  background-color: #8a8a8a;
  & a {
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: "⚠";
    color: transparent;
    text-shadow: 0 0 0 #d20c0c;
    padding-right: 0.4rem;
  }
}

.shooter.dq {
  background-color: #8a8a8a;
  color: #666;
  & a {
    display: flex;
    font-size: 180%;
  }
}

.shooter.active {
  background-color: #ffffff;
  box-shadow: 2px 2px 3px #777;
  & a {
    color: #606060;
    font-weight: bold;
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: "🔫";
    color: transparent;
    text-shadow: 0 0 0 black;
    padding-right: 0.4rem;
  }
}

.shooter.active.dq {
  background-color: #ffffff;
  box-shadow: 2px 2px 3px #777;
  & a {
    color: #606060;
    font-weight: bold;
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: "🚫";
    color: transparent;
    text-shadow: 0 0 0 darkred;
    padding-right: 0.4rem;
  }
}

nav {
  display: flex;
}

/* http://tarangchokshi.weebly.com/blog/how-to-create-flat-style-breadcrumb-links-with-css */
nav.stages {
  background-color: var(--color1);
  & ul {
    width: 100%;
    padding: 0;
    display: flex;
    justify-content: center;
    margin: 0.4rem;
  }
  & ul li {
    display: flex;
    & a {
      width: 6rem;
      padding: 0.2rem 0.4rem 0 0.9rem;
    }
  }
  & ul li.done a {
    display: flex;
    float: left;
    height: 30px;
    background-color: #777;
    color: var(--color2);
    text-align: center;

    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    font-weight: bold;
  }
  & ul li.done a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid #777;
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }

  & ul li.todo a {
    display: flex;
    float: left;
    height: 30px;
    background-color: var(--color2);
    text-align: center;
    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    color: var(--color1);
    font-weight: bold;
  }
  & ul li.todo a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid var(--color2);
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }

  & ul li.active a {
    display: flex;
    float: left;
    height: 30px;
    background-color: white;
    text-align: center;
    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    color: var(--color1);
    font-weight: bold;
  }
  & ul li.active a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid white;
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }
  & ul li a:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid var(--color1);
    position: absolute;
    left: -0px;
    top: 0;
    z-index: 5;
  }
  & ul li:first-child a {
    width: 5.6rem;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  & ul li:first-child a:before {
    display: none;
  }
  & ul li:last-child a {
    padding-right: 0px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  & ul li:last-child a:after {
    display: none;
  }
  & ul li a:hover {
    background: rgba(200, 200, 200, 0.5);
    transition: 0.4s;
  }
  & ul li a:hover:after {
    border-left-color: rgba(200, 200, 200, 0.5);
    transition: 0.4s;
  }
}

nav.shooters {
  background-color: #ddd;
  font-size: 50%;

  & ul {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  & ul li {
    background-color: #8f9d8f;
    border-radius: 0.8rem;
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    padding-left: 0.6rem;
    display: flex;
  }
}

span.active {
  background: white;
  color: #262626;
}
span.inactive {
  background: #546552;
  color: #8f9d8f;
}

table.stage {
  border-radius: 0.3rem;
  background: var(--color2);
  color: #222;
  width: 100%;
  & td {
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
}

th {
  font-size: 140%;
  background-color: var(--color2);
}

th.hit-class {
  width: 10%;
}
th.target {
  width: 20%;
  height: 60px;
  vertical-align: bottom;

  background: url("../assets/logo.svg");
  background-size: 40%;
  background-repeat: no-repeat;
  background-position: top;
  background-color: var(--color2);
  &.ok {
    & span {
      color: darkgreen;
      font-weight: bold;
    }
  }
  &.notok {
    & span {
      color: #4d4032;
      font-weight: normal;
    }
  }
}
th.hits {
  width: 8%;
  font-size: 100%;
}
th.points {
  width: 8%;
  font-size: 100%;
}
th.time {
  width: 24%;
}

th.time {
  padding: 0.3rem;
}

th.time.ok {
  padding: 0.3rem;
  background-color: var(--color2);
  color: darkgreen;
  font-size: 140%;
  transition: 1s;
  & span {
    color: darkgreen;
  }
}

input.seconds {
  width: 5rem;
  background: #fff9d6;
  border: none;
  text-align: right;
  font-size: 130%;
  height: 1.5rem;
}

.stage.dq {
  background-color: #c7c7c7;
  & tr {
    background-color: #c7c7c7;
  }
  & th {
    background-color: #c7c7c7;
  }
  & td {
    background-color: #c7c7c7;
    & input {
      background-color: #c7c7c7;
    }
  }
}

.stage-info-button {
  margin-top: 1rem;
  text-align: right;
}
</style>
