import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// window.CESIUM_BASE_URL = '/'
window.CESIUM_BASE_URL = '/static/Cesium/';
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTU0NGEwMi1jY2ZlLTRlMDAtOTZlNy00MDYzYmVjZGRhZGEiLCJpZCI6NTMwODYsImlhdCI6MTYxODk4NzIxNH0.Tu4Aoz7HZ3kgg9oOgrrbRZcQdDrC6ye2p0GtdK5SNc8'
window.token = '0c1752fa2f4f89f17c1dca53ffeeae1c' //天地图全局token
window.Cesium = Cesium;
Vue.config.productionTip = false
function packAxios(baseUrl,baseAPI){
	baseUrl = baseUrl||""
  let tempAxios = axios.create({
    baseURL:"/"+baseUrl,
    timeout:600000
  })
  // tempAxios.interceptors.request.use(config => {

  // })
  // tempAxios.interceptors.response.use(response => {

  // })
  return tempAxios
}
Vue.prototype.$http = packAxios()
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
