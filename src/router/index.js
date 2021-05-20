import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PersonInfo from '../pages/PersonInfo'
import Course from '../pages/Course'
import Grade from '../pages/Grade'
import Forum from '../pages/Forum'
import CourseDetail from '../components/CourseDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: 'person_info',
          name: 'person_info',
          component: PersonInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'course',
          name: 'course',
          component: Course,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'course_detail/:id',
          name: 'course_detail',
          component: CourseDetail,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'grade',
          name: 'grade',
          component: Grade,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'forum',
          name: 'forum',
          component: Forum,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
