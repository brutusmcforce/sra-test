<script setup lang="ts">

import { useScoresStore } from '@/stores/scores'

const scoresStore = useScoresStore()

</script>


<template>

  <main class="safety">
    <div class="content">

  <h1>Turvallisuus</h1>
  <p>
    Kaikessa aseen käytössä on noudatettava seuraavia turvallisen aseenkäsittelyn sääntöjä:
  </p>
  <ol class="handling-rules">
    <li><b>Asetta on aina käsiteltävä kuin se olisi ladattu</b>.
      Ei ole merkitystä, onko ase ladattu tai onko ase toimimaton käsittelyase, käsittelyn on aina oltava
      samanlaista.</li>
    <li>Piippukontrolli, <b>aseen piipun on aina osoitettava turvalliseen suuntaan</b>.
      "Laser-sääntö", aseella ei saa koskaan osoittaa mitään sellaista, jota ei halua
      tuhota.</li>
    <li>Sormivarmistus, <b>sormi pidetään pois liipaisimelta ennen ampumapäätöstä</b>.
      Liipaisinsormi on pidettävä tietoisesti aseen rungolla. Sormi laitetaan liipaisimelle
      vasta, kun on tehty tietoinen ampumapäätös.</li>
    <li><b>Tunnista maali ja varmista tausta</b>.
      Maali on aina tunnistettava ennen kuin sitä ammutaan. Maalin takana ei saa olla
      omia taistelijoita tai sivullisia.</li>
  </ol>

  <div class="safety-checkbox">
    <input v-model="scoresStore.safetyTrainingCompleted" type="checkbox" id="safety-acknowledgment"/>
    <label for="checkbox">Kaikki ampumakokeen osallistujat tuntevat yllä olevat turvalliset aseen käsittelyn säännöt.</label>
  </div>

  <div class="actions continue">
    <button class="action" :disabled="!scoresStore.safetyTrainingCompleted" @click="scoresStore.safetyTrainingCompleted = true; $router.push('/')">Jatka</button>
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
