import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PersonInfo from '../pages/PersonInfo'
import Course from '../pages/Course'
import Grade from '../pages/Grade'
import Forum from '../pages/Forum'
import CourseDetail from '../components/CourseDetail'
import ForumDetail from '../components/ForumDetail'
import TeacherHome from '../Teacher/TeacherHome'
import TeacherPersonInfo from '../Teacher/TeacherPersonInfo'
import TeacherForum from '../Teacher/TeacherForum'
import TeacherGrade from '../Teacher/TeacherGrade'
import TeacherCourse from '../Teacher/TeacherCourse'
import TeacherCourseDetail from '../Teacher/TeacherCourseDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true,
        requireStudent: true
      },
      children: [
        {
          path: 'person_info',
          name: 'person_info',
          component: PersonInfo,
          meta: {
            requireAuth: true,
            requireStudent: true
          }
        },
        {
          path: 'course',
          name: 'course',
          component: Course,
          meta: {
            requireAuth: true,
            requireStudent: true
          }
        },
        {
          path: 'course_detail/:id',
          name: 'course_detail',
          component: CourseDetail,
          meta: {
            requireAuth: true,
            requireStudent: true
          }
        },
        {
          path: 'grade',
          name: 'grade',
          component: Grade,
          meta: {
            requireAuth: true,
            requireStudent: true
          }
        },
        {
          path: 'forum',
          name: 'forum',
          component: Forum,
          meta: {
            requireAuth: true,
            requireStudent: true
          }
        },
        {
          path: 'question_detail/:id',
          name: 'question_detail',
          component: ForumDetail,
          meta: {
            requireStudent: true
          }
        }
      ]
    },
    {
      path: '/teacher_home',
      name: 'teacher_home',
      component: TeacherHome,
      meta: {
        requireAuth: true,
        requireTeacher: true
      },
      children: [
        {
          path: 'teacher_person_info',
          name: 'teacher_person_info',
          component: TeacherPersonInfo,
          meta: {
            requireAuth: true,
            requireTeacher: true
          }
        },
        {
          path: 'teacher_course',
          name: 'teacher_course',
          component: TeacherCourse,
          meta: {
            requireAuth: true,
            requireTeacher: true
          }
        },
        {
          path: 'teacher_course_detail/:id',
          name: 'teacher_course_detail',
          component: TeacherCourseDetail,
          meta: {
            requireAuth: true,
            requireTeacher: true
          }
        },
        {
          path: 'teacher_grade',
          name: 'teacher_grade',
          component: TeacherGrade,
          meta: {
            requireAuth: true,
            requireTeacher: true
          }
        },
        {
          path: 'teacher_forum',
          name: 'teacher_forum',
          component: TeacherForum,
          meta: {
            requireAuth: true,
            requireTeacher: true
          }
        },
        {
          path: 'teacher_question_detail/:id',
          name: 'teacher_question_detail',
          component: ForumDetail,
          meta: {
            requireAuth: true,
            requireTeacher: true
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
