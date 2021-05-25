// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import VueCookie from 'vue-cookie'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$qs = qs
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.prototype.$axios = axios.create({
  baseURL: 'http://localhost:8085'
})

Vue.use(VueCookie)
router.beforeEach((to, from, next) => {
  // eslint-disable-next-line no-unused-vars
  let isLogin = localStorage.getItem('isLogin')
  isLogin = Boolean(Number(isLogin))
  let role = localStorage.getItem('role')
  role = Number(role)
  if (to.meta.requireAuth) {
    if (isLogin) {
      // console.log(to)
      if (to.meta.requireStudent && role === 0) {
        // console.log('学生页面，学生')
        next()
      } else if (to.meta.requireStudent && role === 1) {
        // console.log('学生页面，教师')
        next({
          path: '/teacher_home',
          query: {redirect: to.fullPath}
        })
      } else if (to.meta.requireTeacher && role === 0) {
        // console.log('教师页面，学生')
        next({
          path: '/',
          query: {redirect: to.fullPath}
        })
      } else {
        // console.log('教师页面，教师')
        next()
      }
    } else {
      console.log('登录')
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>'
})
