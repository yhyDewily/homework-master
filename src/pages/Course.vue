<template>
  <div class="course">
    <template>
      <v-tabs
        v-model="tab"
        fixed-tabs
        background-color="blue darken-2"
        dark
      >
        <v-tab>
          已选课程
        </v-tab>
        <v-tab>
          选课
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">课程编号</th>
                <th class="text-left">课程名称</th>
                <th class="text-left">学院</th>
                <th class="text-left">教师</th>
                <th class="text-left">结课时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in course" :key="index" >
                <td @click="goToDetail(item.courseId)">{{ item.courseId }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.courseName }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.major }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.teacher }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.stopTime }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-pagination v-model="course_page" :length="course_pagination.itemsLength"
                        total-visible="7" :value="course_page" @next="loadStuCourseData(course_page)"
                        @previous="loadStuCourseData(course_page)"
                        @input="loadStuCourseData(course_page)"
          ></v-pagination>
        </v-tab-item>
        <v-tab-item>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">课程编号</th>
                <th class="text-left">课程名称</th>
                <th class="text-left">学院</th>
                <th class="text-left">教师</th>
                <th class="text-left">结课时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in courseList" :key="index" >
                <td @click="goToDetail(item.courseId)">{{ item.courseId }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.courseName }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.major }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.teacher }}</td>
                <td @click="goToDetail(item.courseId)">{{ item.stopTime }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-pagination v-model="choose_page" :length="choose_pagination.itemsLength"
                        total-visible="7" :value="choose_page" @next="loadCourseData(choose_page)"
                        @previous="loadCourseData(choose_page)"
                        @input="loadCourseData(choose_page)"
          ></v-pagination>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Course',
  computed: {
    ...mapState(
      ['username']
    )
  },
  data: () => ({
    tab: null,
    course_page: 1,
    course_totalElements: 0,
    course_totalNums: 0,
    course_pagination: {
      page: 1,
      itemsPerPage: 10,
      pageStart: 1,
      pageStop: 5,
      pageCount: 5,
      itemsLength: 0
    },
    choose_page: 1,
    choose_totalElements: 0,
    choose_totalNums: 0,
    choose_pagination: {
      page: 1,
      itemsPerPage: 10,
      pageStart: 1,
      pageStop: 5,
      pageCount: 5,
      itemsLength: 0
    },
    course: [], // 已选课程
    courseList: [], // 全部课程
    courseHeaders: [
      {
        text: '课程编号',
        value: 'courseId'
      },
      {
        text: '课程名称',
        value: 'courseName'
      },
      {
        text: '学院',
        value: 'major'
      },
      {
        text: '教师',
        value: 'teacher'
      },
      {
        text: '结课时间',
        value: 'stopTime'
      }
    ]

  }),
  mounted () {
    this.getChosenCourse()
    this.getAllCourse()
  },
  methods: {
    getChosenCourse () {
      this.$axios.post('/course/get_student_course.do').then(
        res => {
          console.log(res)
          this.course = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
          this.course_pagination.itemsLength = res.data.data.totalPages
        }
      )
    },
    getAllCourse () {
      this.$axios.post('/course/get_all.do').then(
        res => {
          console.log(res)
          this.courseList = res.data.data.content
          this.choose_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
          this.choose_pagination.itemsLength = res.data.data.totalPages
        }
      )
    },
    goToDetail (val) {
      this.$router.push('/course_detail/' + val)
    },
    loadStuCourseData (val) {
      this.$axios.post('/course/get_student_course.do', this.$qs.stringify({
        pageNum: val
      })).then(res => {
        this.course = res.data.data.content
        this.choose_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
      })
    },
    loadCourseData (val) {
      this.$axios.post('/course/get_all.do', this.$qs.stringify({
        pageNum: val
      }
      )).then(
        res => {
          this.courseList = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
