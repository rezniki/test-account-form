import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/dist/vuetify.min.css'; // Импортируем стили Vuetify
import '@mdi/font/css/materialdesignicons.css'; // Иконки Material Design

const vuetify = createVuetify({
    components,
    directives,
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(vuetify);

app.mount('#app');