<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{ stage: number }>()
defineEmits<{ close: [] }>()

const { t, tm } = useI18n()

const description = () => {
  const list = tm('stages.description') as unknown as string[]
  return list[props.stage]
}
</script>

<template>
  <div class="stage-info-overlay"></div>
  <div class="stage-info">
    <h2>{{ t('scoring.stage') }} {{ stage + 1 }}</h2>
    <p>{{ description() }}</p>
    <div class="stage-info-button">
      <button class="close action" @click="$emit('close')">
        {{ t('scoring.close') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.stage-info-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
}
.stage-info {
  position: relative;
  z-index: 9999;
  margin: 0 auto;
  padding: 10px 20px;
  min-width: 300px;
  width: 80%;
  background-color: #fff;
}
.stage-info-button {
  margin-top: 1rem;
  text-align: right;
}
</style>
