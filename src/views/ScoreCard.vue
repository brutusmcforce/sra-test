<script setup lang="ts">
import {computed, onMounted, ref } from 'vue'
import {useRoute} from 'vue-router'
import {SraShootingTest} from "@/classes/SraShootingTest";
import { UserSquare, ShareAndroid, Copy  } from '@iconoir/vue'
import { useI18n } from 'vue-i18n'

import pako from 'pako';

import QRCode from 'qrcode'

const route = useRoute()
const { t } = useI18n()

const qrCanvas = ref<HTMLCanvasElement | null>(null)

/**
 * Assembles score card data either
 * - from the app's Pinia store if the score card was reached via the result list
 * - from the HTTP GET parameter d, a compressed base64-encoded JSON structure
 */
function assembleData(encoded: string | null): CardData | null {
  if (encoded == null) {
    return null
  }
  try {
    return decode(encoded) as CardData
  } catch (err) {
    console.error(t('scoreCard.parseFailed'), err)
    return null
  }

}

onMounted(async () => {
  if (!qrCanvas.value) return
  try {
    await QRCode.toCanvas(qrCanvas.value, qrCodeUrl, {
      errorCorrectionLevel: 'M',
    })
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
})


const base64Data = route.query.d as string | undefined

const data : CardData | null = assembleData(base64Data)

const qrCodeUrl = window.location.href

const formatHits = (hits: Array<number>) : string => {
  let result = ""
  if (hits[0] as number > 0) { result = result.concat(hits[0] + 'A') }
  if (hits[1] as number > 0) { result = result.concat(" " + hits[1] + 'C') }
  if (hits[2] as number > 0) { result =result.concat(" " + hits[2] + 'D') }
  if (hits[3] as number > 0) { result =result.concat(" " + hits[3] + 'M') }
  if (hits[4] as number > 0) { result =result.concat(" " + hits[4] + 'R') }
  return result
}

const formatHF = (hf: number) : string => (!isNaN(hf) && hf != Infinity ) ? hf.toFixed(2) : ""

const formatTime = (time: number) : string => time > 0 ? time.toFixed(2) + " s" : ""

/** Returns a stable status key: 'failed', 'in-progress', or 'passed', or null if undeterminable. */
const resultStatus = (data: CardData): 'failed' | 'in-progress' | 'passed' | null => {
  if (effectiveDqReason.value != null) {
    return 'failed'
  }
  if (!testComplete(data)) {
    return 'in-progress'
  }
  if (hitFactor(data) >= SraShootingTest.requiredHitFactor) {
    return 'passed'
  }
  return null
}

const resultText = (data: CardData) => {
  const status = resultStatus(data)
  switch (status) {
    case 'failed': return t('result.failed')
    case 'in-progress': return t('result.inProgress')
    case 'passed': return t('result.passed')
    default: return ''
  }
}

/** Auto-DQ check based on data: all stages have time and >=40 hits but HF < required. */
const isAutoDq = (data: CardData): boolean => {
  if (data.h != null && data.h !== '') return false
  if (data.a.find(time => time == 0) != null) return false
  const totalHits = data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0)).reduce((acc, n) => acc + n, 0)
  if (totalHits < 40) return false
  return hitFactor(data) < SraShootingTest.requiredHitFactor
}

const effectiveDqReason = computed(() => {
  if (data == null) return null
  if (data.h != null && data.h !== '') return data.h
  if (isAutoDq(data)) return t('shooter.autoDqReason', { factor: SraShootingTest.requiredHitFactor })
  return null
})

const testComplete = (data: CardData): boolean => {
  // Disqualified: complete
  if (data.h != null) {
    return true
  }
  // A stage is missing a time: not complete
  else if (data.a.find(time => time == 0) != null) {
    return false
  }
  // Fewer than 40 scored hits: not complete
  else if (data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0)).reduce((acc, n) => acc + n, 0) < 40) {
    return false
  }
  return true
}

function hitFactor(data: CardData) {
  return points(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) / data.a.reduce((sum, val) => sum + val, 0)
}

function decode<T = unknown>(encoded: string): CardData {
  const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=')
  // URL-safe to standard Base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = window.atob(base64)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  const json = pako.inflate(bytes, { to: 'string' })
  return JSON.parse(json as string) as CardData
}

function points(hits : Array<number>): number {
  // Don't compute points if no hits have been recorded for this stage
  if (hits.filter(a => a === 0).length == 6) {
    return ""
  }
  return Math.max(0, 5*hits[0] + 3*hits[1] + hits[2] - 10*hits[3] -10*hits[4])
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    prompt(t('scoreCard.copyPrompt'), window.location.href)
  }
}

const sharePage = async () => {
  const shareData = {
    title: document.title,
    text: t('scoreCard.shareText'),
    url: window.location.href
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // user cancelled share
    }
  } else {
    await copyLink()
  }
}

const shareSupported = !!navigator.share

onMounted(() => {
  document.title = (data?.n != undefined ? data.n + " - ":  "") + t('scoreCard.documentTitle')
})

</script>

<template>

  <main>

    <p class="invalid-link" v-if="data == null">
      {{ t('scoreCard.invalidLink') }}
    </p>

    <div v-if="data != null" class="main">

      <h1 class="score-card-title-1"><a :href="baseUrl">{{ t('scoreCard.title') }}</a></h1>
      <h2 class="score-card-title-2">{{ t('scoreCard.scoreCard') }}</h2>
      <div class="date-and-place">
        {{ data.dl }}
      </div>
      <div class="name-card">
        <UserSquare width="4rem" height="4rem" color="#888"/><h1>{{ data.n }}</h1>
      </div>

      <table class="score-card">
        <thead>
        <tr>
          <th>{{ t('scoreCard.columnStage') }}</th><th>{{ t('scoreCard.columnHits') }}</th><th>{{ t('scoreCard.columnPoints') }}</th><th>{{ t('scoreCard.columnTime') }}</th><th :title="t('scoreCard.columnHfTooltip')">HF</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stage in [0,1,2,3,4]" :key="stage" class="stage">
          <th>{{stage+1}}</th>
          <td>
            <span>
              {{ formatHits(data.r[stage])}}
            </span>
          </td>
          <td>
            <span>
            {{ points(data.r[stage]) }}

            </span>
          </td>

          <td>
            <span>
            {{ formatTime(data.a[stage]) }}
            </span>
          </td>
          <td>
            <span>
              {{ formatHF(points(data.r[stage]) / data.a[stage]) }}
            </span>
          </td>
        </tr>
        <tr class="total">
          <th>{{ t('scoreCard.total') }}</th>
          <td>{{ formatHits(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ points(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ formatTime(data.a.reduce((sum, val) => sum + val, 0)) }}</td>
          <td>{{ formatHF(hitFactor(data)) }}</td>
        </tr>
        <tr>
          <th colspan="3">{{ t('scoreCard.resultLabel') }}</th><td colspan="2">
          <span id="result" v-bind:class="resultStatus(data) ?? ''">
          {{ resultText(data) }}
          </span>
        </td>
        </tr>
        <tr v-if="effectiveDqReason != null">
          <th colspan="3">{{ t('scoreCard.dqReasonLabel') }}</th>
          <td colspan="2">
            {{ effectiveDqReason }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="testComplete(data) && (data.tn != '' || data.tno != '')" class="referee-stamp">
        <div v-if="data.tn">{{ data.tn }}</div>
        <div v-if="data.tno">{{ t('scoreCard.sraReferee') }} {{ data.tno }}</div>
      </div>


    </div>

    <div v-if="data != null && testComplete(data)" class="qr-code-container">
      <canvas id="qrcode" ref="qrCanvas" title=""></canvas>

      <div class="actions">
        <button v-if=shareSupported @click="sharePage" class="action">
          <ShareAndroid /><span>{{ t('scoreCard.share') }}</span>
        </button>

        <button @click="copyLink" class="action">
          <Copy /><span>{{ t('scoreCard.copyLink') }}</span>
        </button>
      </div>
    </div>

    <div v-if="data != null && testComplete(data)" class="not-stored">
      {{ t('scoreCard.notStored') }}
    </div>

    <div class="footer">
      <a :href="baseUrl">{{ t('shootingTestApp') }}</a>
    </div>

  </main>

</template>

<script lang="ts">
const baseUrl = import.meta.env.BASE_URL
</script>
