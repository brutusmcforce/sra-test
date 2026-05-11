<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RulesViewFi from './RulesView.fi.vue'
import RulesViewSv from './RulesView.sv.vue'

const { locale } = useI18n()
const view = computed(() => (locale.value === 'fi' ? RulesViewFi : RulesViewSv))
</script>

<template>
  <component :is="view" />
</template>
