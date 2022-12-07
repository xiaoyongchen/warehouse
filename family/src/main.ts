import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store, { storeKey } from './store'

// i18n
import i18n from '@/locales/i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(store, storeKey)
app.use(require('vue-wechat-title'))
app.mount('#app')
