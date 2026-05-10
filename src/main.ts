import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)

document.documentElement.setAttribute('lang', i18n.global.locale.value)

// Redirect handling (see 404.html): when the static 404 page bounces us here
// with a sessionStorage redirect path, finish routing before mounting.
const redirectPath = sessionStorage.getItem('redirectPath')
const ready = redirectPath ? router.replace(redirectPath) : Promise.resolve()
ready.finally(() => app.mount('#app'))
