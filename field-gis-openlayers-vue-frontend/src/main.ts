import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App);

app.config.globalProperties.$foo = 'bar';

app.use(store).mount('#app')
