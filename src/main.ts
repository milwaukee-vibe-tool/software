import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(Quasar)
app.use(pinia)

app.mount('#app')
