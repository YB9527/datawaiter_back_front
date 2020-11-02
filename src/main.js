import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

import uuid from 'vue-uuid'
Vue.use(uuid)

import Tool from  '@/_datawaiter/js/Tool.js';
Vue.prototype.$tool = Tool;

import UITool from  '@/_datawaiter/js/UITool.js';
Vue.prototype.$uiTool = UITool;

import StrTool from  '@/_datawaiter/js/StrTool.js';
Vue.prototype.$strTool = StrTool;

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
/**
 * 默认保留两位小数
 */
Vue.filter('toFixedFilter', (value,bit) => {

  return Tool.toFixed(value,bit?bit:2,0);
});
Vue.filter('moneySymbol', (value) => {

  return Tool.moneySymbol(value);
});

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
