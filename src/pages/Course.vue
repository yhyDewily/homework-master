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
        </v-tab-item>
        <v-tab-item>
          <v-data-table
            :headers="courseHeaders"
            :items="course"
            item-key="id"
            hide-default-footer
          ></v-data-table>
          <v-pagination v-model="page" :length="pagination.itemsLength"
                        total-visible="7" :value="page" @next="loadData(page)"
                        @previous="loadData(page)"
                        @input="loadData(page)"
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
    page: 1,
    totalElements: 0,
    totalNums: 0,
    pagination: {
      page: 1,
      itemsPerPage: 10,
      pageStart: 1,
      pageStop: 5,
      pageCount: 5,
      itemsLength: 0
    },
    course: [],
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
  },
  methods: {
    getChosenCourse () {
      this.$axios.post('/course/get_student_course.do').then(
        res => {
          console.log(res)
          this.course = res.data.data.content
        }
      )
    },
    goToDetail (val) {
      this.$router.push('/course_detail/' + val)
    }
  }
}
</script>

<style scoped>

</style>
