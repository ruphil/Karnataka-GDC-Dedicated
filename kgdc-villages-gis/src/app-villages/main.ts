import { createApp } from 'vue';
import App from './app-villages/App.vue';
import store from '../shared/store';

createApp(App).use(store).mount('#app');
