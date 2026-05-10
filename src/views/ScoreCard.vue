<script setup lang="ts">
import {onMounted, ref } from 'vue'
import {useRoute} from 'vue-router'
import {SraShootingTest} from "@/classes/SraShootingTest";
import { UserSquare, ShareAndroid, Copy  } from '@iconoir/vue'

import pako from 'pako';

import QRCode from 'qrcode'

const route = useRoute()

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
    console.error('Tulostietojen tulkitseminen epäonnistui - onko linkki kopioitu virheellisesti?', err)
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

const formatResult = (data: CardData) => {
  if (data.h != null) {
    return "HYLÄTTY"
  }
  if (!testComplete(data)) {
    return "KESKEN"
  }
  if (hitFactor(data) >= SraShootingTest.requiredHitFactor) {
    return "HYVÄKSYTTY"
  }
}

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
    prompt('Kopioi tämä linkki:', window.location.href)
  }
}

const sharePage = async () => {
  const shareData = {
    title: document.title,
    text: 'SRA-ampumakokeen tuloskortti',
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
  document.title = (data?.n != undefined ? data.n + " - ":  "") + 'SRA-ampumakokeen tuloskortti'
})

</script>

<template>

  <main>

    <p class="invalid-link" v-if="data == null">
      Linkin tulostietojen käsittely ei onnistunut. Onko linkki kopioitu oikein?
    </p>

    <div v-if="data != null" class="main">

      <h1 class="score-card-title-1"><a :href="baseUrl">SRA Ampumakoe</a></h1>
      <h2 class="score-card-title-2">Tuloskortti</h2>
      <div class="date-and-place">
        {{ data.dl }}
      </div>
      <div class="name-card">
        <UserSquare width="4rem" height="4rem" color="#888"/><h1>{{ data.n }}</h1>
      </div>

      <table class="score-card">
        <thead>
        <tr>
          <th>Rasti</th><th>Osumat</th><th>Pisteet</th><th>Aika</th><th title="Osumakerroin: pisteet jaettuna ajalla (sekunnit).">HF</th>
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
          <th>Yht.</th>
          <td>{{ formatHits(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ points(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ formatTime(data.a.reduce((sum, val) => sum + val, 0)) }}</td>
          <td>{{ formatHF(hitFactor(data)) }}</td>
        </tr>
        <tr>
          <th colspan="3">Tulos</th><td colspan="2">
          <span id="result" v-bind:class="formatResult(data)">
          {{ formatResult(data) }}
          </span>
        </td>
        </tr>
        <tr v-if="data.h != null && data.h != ''">
          <th colspan="3">Hylkäyksen syy</th>
          <td colspan="2">
            {{ data.h }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="testComplete(data) && (data.tn != '' || data.tno != '')" class="referee-stamp">
        <div v-if="data.tn">{{ data.tn }}</div>
        <div v-if="data.tno">SRA-tuomari {{ data.tno }}</div>
      </div>


    </div>

    <div v-if="data != null && testComplete(data)" class="qr-code-container">
      <canvas id="qrcode" ref="qrCanvas" title=""></canvas>

      <div class="actions">
        <button v-if=shareSupported @click="sharePage" class="action">
          <ShareAndroid /><span>Jaa</span>
        </button>

        <button @click="copyLink" class="action">
          <Copy /><span>Kopioi linkki</span>
        </button>
      </div>
    </div>

    <div v-if="data != null && testComplete(data)" class="not-stored">
      Tulostietoja ei tallenneta palvelimelle. Tällä sivulla esitetyt tulostiedot on sisällytetty QR-koodin linkin
      tietoihin.
    </div>

    <div class="footer">
      <a :href="baseUrl">SRA-koe sovellus</a>
    </div>

  </main>

</template>

<script lang="ts">
const baseUrl = import.meta.env.BASE_URL
</script>
