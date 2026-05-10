<script setup lang="ts">

import { useScoresStore } from '@/stores/scores'
import { useI18n } from 'vue-i18n'

const scoresStore = useScoresStore()
const { t } = useI18n()

</script>


<template>

  <main class="safety">
    <div class="content">

  <h1>{{ t('safety.heading') }}</h1>
  <p>
    {{ t('safety.intro') }}
  </p>
  <ol class="handling-rules">
    <li><b>{{ t('safety.rule1Bold') }}</b>.
      {{ t('safety.rule1Body') }}</li>
    <li>{{ t('safety.rule2Prefix') }}<b>{{ t('safety.rule2Bold') }}</b>.
      {{ t('safety.rule2Body') }}</li>
    <li>{{ t('safety.rule3Prefix') }}<b>{{ t('safety.rule3Bold') }}</b>.
      {{ t('safety.rule3Body') }}</li>
    <li><b>{{ t('safety.rule4Bold') }}</b>.
      {{ t('safety.rule4Body') }}</li>
  </ol>

  <div class="safety-checkbox">
    <input v-model="scoresStore.safetyTrainingCompleted" type="checkbox" id="safety-acknowledgment"/>
    <label for="checkbox">{{ t('safety.acknowledgment') }}</label>
  </div>

  <div class="actions continue">
    <button class="action" :disabled="!scoresStore.safetyTrainingCompleted" @click="scoresStore.safetyTrainingCompleted = true; $router.push('/')">{{ t('safety.continue') }}</button>
  </div>
    </div>
  </main>
</template>

<style>

main.safety {
  background-image: linear-gradient(to bottom, rgba(233, 233, 233, .3), rgba(233, 233, 233, 2)), url("../assets/9mm.jpg");
  padding: 8rem 0 0 0;

}

.content {
  background-color: rgba(233,233,233,.8);
  padding: 1rem;
}


.about h1,h2 {
  color: var(--color1);
  font-weight: bold;
  padding-top: 1rem;
}

.about {
  padding: 1rem;
}

.handling-rules li {
  margin-top: 1.2rem;
}

a {
  color: var(--color-text);
}

.actions.continue {
  flex-direction: row-reverse;
}

.safety-checkbox {
  padding: 1rem 0 1rem 0;


  & input[type=checkbox] {
    transform: scale(2.0);
    padding: 1rem;
    margin: 1rem;
  }
}



</style>
