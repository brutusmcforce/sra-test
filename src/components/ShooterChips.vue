<script setup lang="ts">
import { useScoresStore } from '@/stores/scores'
import { StageStatus } from '@/classes/SraShootingTest'
import { useStageNavigation } from '@/composables/useStageNavigation'

const props = defineProps<{
  shooter: string
  stage: number
}>()

const scoresStore = useScoresStore()
const { rotateOrder, shortenName } = useStageNavigation()

const chipClass = (aid: string): string => {
  const isActive = aid === props.shooter
  const isDq = aid in scoresStore.disqualifications
  if (isActive) return isDq ? 'active dq' : 'active'
  if (isDq) return 'inactive dq'
  switch (scoresStore.getStageStatus(aid, props.stage)) {
    case StageStatus.InProgress: return 'inactive incomplete'
    case StageStatus.NotStarted: return 'inactive notdone'
    case StageStatus.Completed: return 'inactive done'
  }
}
</script>

<template>
  <nav class="shooters">
    <ul>
      <li
        v-for="aid in rotateOrder(Object.keys(scoresStore.scores), stage)"
        :key="aid"
        :class="chipClass(aid)"
      >
        <a :href="`../../entry/${stage}/${aid}`">{{ shortenName(aid) }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav.shooters {
  display: flex;
  background-color: #ddd;
  font-size: 50%;
}
nav.shooters ul {
  padding: 0.4rem 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
nav.shooters li {
  background-color: #8f9d8f;
  border-radius: 0.8rem;
  margin: 0.1rem 0.2rem;
  padding-left: 0.6rem;
  display: flex;
}

nav.shooters li a {
  display: flex;
  font-size: 180%;
}

/* Status icons via ::before. Default colored background per status. */
nav.shooters li::before {
  color: transparent;
  padding-right: 0.4rem;
}

nav.shooters li.done { background-color: #8d8d8d; }
nav.shooters li.done a { color: var(--color2); }
nav.shooters li.done::before { content: '✔'; text-shadow: 0 0 0 green; }

nav.shooters li.notdone { background-color: var(--color2); }
nav.shooters li.notdone a { color: var(--color1); }
nav.shooters li.notdone::before { content: '👤'; text-shadow: 0 0 0 black; }

nav.shooters li.incomplete { background-color: #8a8a8a; }
nav.shooters li.incomplete::before { content: '⚠'; text-shadow: 0 0 0 #d20c0c; }

nav.shooters li.dq {
  background-color: #8a8a8a;
  color: #666;
}

nav.shooters li.active {
  background-color: #ffffff;
  box-shadow: 2px 2px 3px #777;
}
nav.shooters li.active a {
  color: #606060;
  font-weight: bold;
}
nav.shooters li.active::before { content: '🔫'; text-shadow: 0 0 0 black; }
nav.shooters li.active.dq::before { content: '🚫'; text-shadow: 0 0 0 darkred; }
</style>
