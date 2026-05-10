<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useScoresStore } from "@/stores/scores";
import { StageStatus } from "@/classes/SraShootingTest";

const props = defineProps<{ shooter: string; currentStage: number }>();
const scoresStore = useScoresStore();
const { t } = useI18n();

const stageStatusClass = (s: number): "active" | "done" | "todo" => {
  if (s === props.currentStage) return "active";
  const activeShooters = Object.keys(scoresStore.scores).filter(
    (sh) => !(sh in scoresStore.disqualifications),
  );
  if (activeShooters.length === 0) return "todo";
  const allDone = activeShooters.every(
    (sh) => scoresStore.getStageStatus(sh, s) === StageStatus.Completed,
  );
  return allDone ? "done" : "todo";
};
</script>

<template>
  <nav class="stages">
    <ul>
      <li v-for="s in [0, 1, 2, 3, 4]" :key="s" :class="stageStatusClass(s)">
        <a :href="`../../entry/${s}/${shooter}`"
          >{{ t("scoring.stage") }} {{ s + 1 }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Flat-style breadcrumb. Color comes from the .done/.todo/.active modifiers below. */
nav.stages {
  background-color: var(--color1);
}
nav.stages ul {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0.4rem;
}
nav.stages li {
  display: flex;
}

/* Shared arrow chrome — colors set per status. */
nav.stages li a {
  display: flex;
  height: 30px;
  width: 6rem;
  padding: 0.2rem 0.4rem 0 0.9rem;
  margin: 0 6px 0 0;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  font-size: 95%;
  font-weight: bold;
  position: relative;
}
nav.stages li a::before,
nav.stages li a::after {
  content: "";
  position: absolute;
  top: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
nav.stages li a::before {
  border-left: 10px solid var(--color1);
  left: 0;
  z-index: 5;
}
nav.stages li a::after {
  border-left: 10px solid transparent;
  right: -9px;
  z-index: 10;
}

/* Status colors */
nav.stages li.done a {
  background-color: #777;
  color: var(--color2);
}
nav.stages li.done a::after {
  border-left-color: #777;
}

nav.stages li.todo a {
  background-color: var(--color2);
  color: var(--color1);
}
nav.stages li.todo a::after {
  border-left-color: var(--color2);
}

nav.stages li.active a {
  background-color: white;
  color: var(--color1);
}
nav.stages li.active a::after {
  border-left-color: white;
}

/* First/last segment rounded corners */
nav.stages li:first-child a {
  width: 3.9rem;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
nav.stages li:first-child a::before {
  display: none;
}
nav.stages li:last-child a {
  padding-right: 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
nav.stages li:last-child a::after {
  display: none;
}

nav.stages li a:hover {
  background: rgba(200, 200, 200, 0.5);
  transition: 0.4s;
}
nav.stages li a:hover::after {
  border-left-color: rgba(200, 200, 200, 0.5);
  transition: 0.4s;
}
</style>
