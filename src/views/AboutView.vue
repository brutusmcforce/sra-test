<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="about">
    <h1>{{ t("about.heading") }}</h1>

    <p>
      {{ t("about.description") }}
    </p>

    <h2>{{ t("about.privacyHeading") }}</h2>
    <p>
      {{ t("about.privacyBody") }}
    </p>

    <h2>{{ t("about.feedbackHeading") }}</h2>

    <p>
      {{ t("about.feedbackBody")
      }}<a href="mailto:magnus@raketlaboratoriet.se"
        >magnus@raketlaboratoriet.se</a
      >.
    </p>
    <p>
      <a href="https://github.com/brutusmcforce/sra-test">{{
        t("about.githubLink")
      }}</a>
    </p>

    <h2>{{ t("about.creditsHeading") }}</h2>
    <p>
      {{ t("about.creditsBody")
      }}<a
        href="https://github.com/mpolla/sra-koe"
        target="_blank"
        rel="noopener"
        >github.com/mpolla/sra-koe</a
      >.
    </p>
  </div>
</template>

<style>
.about h1,
h2 {
  color: var(--color1);
  font-weight: bold;
  padding-top: 1rem;
}

.about {
  padding: 1rem;
}

a {
  color: var(--color-text);
}

p {
  margin-top: 1rem;
}
</style>
