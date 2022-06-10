import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import axios from './utils/axios'
// 引入全局样式;
import "./assets/css/global.css";
// 引入iconfont;
import "./assets/font/iconfont.css";

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')
app.config.globalProperties.$http=axios
