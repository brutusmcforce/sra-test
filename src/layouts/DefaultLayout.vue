<template>
  <div>
    <header style="background: #ddd">
      <div class="wrapper">
        <nav class="nav-menu">
          <RouterLink to="/"
            ><span class="icon">☰</span> {{ t("nav.resultList") }}</RouterLink
          >
          <RouterLink to="/range-setup"
            ><span class="icon">▦</span> {{ t("nav.rangeSetup") }}</RouterLink
          >
          <RouterLink to="/rules"
            ><span class="icon">§</span> {{ t("nav.rules") }}</RouterLink
          >
          <RouterLink to="/about"
            ><span class="icon">ⓘ</span> {{ t("nav.about") }}</RouterLink
          >
          <select
            class="lang-picker"
            :value="locale"
            @change="onLocaleChange"
            :aria-label="t('language.label')"
          >
            <option value="sv">{{ t("language.sv") }}</option>
            <option value="fi">{{ t("language.fi") }}</option>
            <option value="en">{{ t("language.en") }}</option>
          </select>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { setLocale } from "@/i18n";

const { t, locale } = useI18n();

const onLocaleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  setLocale(target.value);
};
</script>
<style scoped>
.lang-picker {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  padding: 0.1rem 0.2rem;
  background: rgba(255, 255, 255, 0.15);
  color: var(--color2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.lang-picker option {
  color: #222;
  background: white;
}
</style>
