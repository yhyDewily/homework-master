<template>
  <div class="course">
    <v-card>
      <v-card-title>
        课程管理
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >
          <template v-slot:activator="{ on, attrs}"
          >
            <v-btn
              color="primary"
              dark
              class="mx-2"
              v-bind="attrs"
              v-on="on"
            >
              新增课程
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">新开课程</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="course" style="width: 80%; margin-left: auto; margin-right: auto">
                <v-text-field
                  v-model="new_course.name"
                  label="课程名"
                  :rules="courseRules.nameRules"
                  required
                  :counter="20"
                ></v-text-field>
                <v-select
                  :items="college"
                  label="开课学院"
                  v-model="new_course.major"
                ></v-select>
                <v-text-field
                  v-model="new_course.stopTime"
                  label="结课日期"
                  :rules="courseRules.dateRules"
                  hint="格式例如：1998-06-26"
                  required
                >
                </v-text-field>
                <v-textarea
                  v-model="new_course.intro"
                  label="课程简介"
                  counter
                  hint="简介至少10个字"
                  :rules="courseRules.introRules"
                  required
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="submitCourse">提交</v-btn>
              <v-btn color="error" @click="dialog=false">取消</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-spacer>
        </v-spacer>
        <v-text-field
        v-model="keyword"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
      :headers="courseHeaders"
      :items="course"
      :search="keyword"
      @click:row="goToDetail"
      >
      </v-data-table>
    </v-card>
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
    new_course: {
      name: '',
      intro: '',
      major: '',
      stopTime: ''
    },
    courseRules: {
      nameRules: [
        v => !!v || '课程名不能为空',
        v => (v && v.length > 2) || '课程名过短'
      ],
      dateRules: [
        v => !!v || '结课日期不能为空',
        v => /^[1-9]\d{3}-([1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(v) || '日期格式无效'
      ],
      introRules: [
        v => !!v || '填写简介方便同学理解课程',
        v => (v && v.length >= 10) || '简介过短'
      ]
    },
    college: ['理学院', '文学院', '外国语学院', '管理学院', '法学院', '通信与信息工程学院', '计算机工程与科学', '机电工程与自动化学院', '材料科学院与工程学院', '环境与化学工程学院', '生命科学学院', '上海美术学院', '上海电影学院', '悉尼工商学院', '土木工程系', '社会学院', '体育学院', '经济学院', '音乐学院'],
    dialog: false,
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
        text: '结课时间',
        value: 'stopTime'
      }
    ]

  }),
  mounted () {
    this.getTeacherCourse()
  },
  methods: {
    getTeacherCourse () {
      this.$axios.post('/course/get_course_info_by_teacher.do')
        .then(res => {
          console.log(res)
          this.course = res.data.data.content
          this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
        })
    },
    submitCourse () {
      if (this.$refs.course.validate()) {
        this.$axios.post('/course/submit_course.do', this.$qs.stringify({
          courseName: this.new_course.name,
          major: this.new_course.major,
          stopTime: this.new_course.stopTime,
          intro: this.new_course.intro
        })).then(res => {
          if (res.data.status === 0) {
            window.alert('创建成功')
            this.dialog = false
            this.getTeacherCourse()
          } else {
            window.alert(res.data.msg)
            this.dialog = false
          }
        })
      }
    },
    goToDetail (val) {
      this.$router.push('/teacher_home/teacher_course_detail/' + val.courseId)
    },
    loadStuCourseData (val) {
      this.$axios.post('/course/get_course_info_by_teacher.do', this.$qs.stringify({
        pageNum: val
      })).then(res => {
        this.course = res.data.data.content
        this.course_pagination.itemsLength = Math.floor(res.data.data.totalElements / 10)
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
    },
    trim (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    }
  }
}
</script>

<style scoped>

</style>
