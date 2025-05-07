import { createApp } from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ElementPlusX from 'vue-element-plus-x';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';


const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus);
app.use(ElementPlusX);
app.mount('#app');
