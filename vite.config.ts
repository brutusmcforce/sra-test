import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,ts,css,html,ico,jpg,png,pdf,svg}'],
      },
      manifest: {
        id: '/sra-koe/',
        lang: 'sv',
        name: 'SRA ampumakokeen pistelaskuri',
        short_name: 'SRA koe',
        description: 'Sovellettu reserviläisammunta (SRA) ampumakokeen pistelaskuri.',
        start_url: '/sra-koe/',
        scope: '/sra-koe/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        theme_color: '#546552',
        background_color: '#e7d7a6',
        categories: ['sports', 'utilities'],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  base: '/sra-koe/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
