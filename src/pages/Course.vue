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
      <v-radio-group v-model="search_action"
                     row
                     style="width: 60%; margin-left: auto; margin-right: auto">
        <v-radio label="课程名查询" value="1"></v-radio>
        <v-radio label="课程号查询" value="2"></v-radio>
      </v-radio-group>
      <v-text-field
        v-model="keyword"
        label="搜索"
      append-outer-icon="mdi-magnify"
      style="width: 60%; margin-right: auto; margin-left: auto"
        @click:append-outer="searchCourse"
      ></v-text-field>
      <v-btn v-show="search"
             color="error"
             @click="resetList"
             style="float:right; margin-right: 20px"
      >重置</v-btn>
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
                <th class="text-left">选课</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in courseList" :key="index" >
                <td>{{ item.courseId }}</td>
                <td>{{ item.courseName }}</td>
                <td>{{ item.major }}</td>
                <td>{{ item.teacher }}</td>
                <td>{{ item.stopTime }}</td>
                <td>
                  <v-btn class="mb-1" x-small color="success" @click="add_stu_course(item.courseId)">选课</v-btn>
                </td>
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
    search: false,
    search_action: 0,
    keyword: '',
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
    this.getUnselectCourse()
  },
  methods: {
    getChosenCourse () {
      this.$axios.post('/course/get_student_course.do').then(
        res => {
          this.course = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
          this.course_pagination.itemsLength = res.data.data.totalPages
        }
      )
    },
    getUnselectCourse () {
      this.$axios.post('/course/get_unchosen_course.do').then(
        res => {
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
      this.$axios.post('/course/get_unchosen_course.do', this.$qs.stringify({
        pageNum: val
      }
      )).then(
        res => {
          this.courseList = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
        }
      )
    },
    add_stu_course (courseId) {
      console.log(courseId)
      this.$axios.post('/course/add_stu_course.do', this.$qs.stringify({
        courseId: courseId
      })).then(res => {
        if (res.data.status === 0) {
          this.getUnselectCourse()
          this.getChosenCourse()
          this.tab = 0
        }
      })
    },
    searchCourse () {
      if (this.search_action === 0) {
        return
      }
      if (this.keyword === '') {
        return
      }
      this.$axios.post('/course/search_course.do', this.$qs.stringify({
        keyword: this.keyword,
        action: this.search_action,
        tab: this.tab
      })).then(res => {
        this.search = true
        if (this.tab === 0) {
          this.course = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
          this.course_pagination.itemsLength = res.data.data.totalPages
        } else {
          this.courseList = res.data.data.content
          this.choose_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
          this.choose_pagination.itemsLength = res.data.data.totalPages
        }
      })
    },
    resetList () {
      this.keyword = ''
      this.getUnselectCourse()
      this.getChosenCourse()
    }
  }
}
</script>

<style scoped>

</style>
