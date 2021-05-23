<template>
  <div class="grade">
    <v-card
      style="width: 60%; margin-right: auto; margin-left: auto"
      outlined
    >
      <v-card-title>
        成绩查看
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜索"
        single-line
        hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="courseGradeList"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.finalGrade="{ item }">
          <v-chip
            :color="getColor(item.finalGrade)"
            dark
          >
            {{ item.finalGrade }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Grade',
  data () {
    return {
      search: '',
      headers: [
        {
          text: '课程',
          align: 'start',
          sortable: false,
          value: 'courseName'
        },
        {
          text: '总成绩',
          value: 'finalGrade'
        },
        {
          text: '平时成绩',
          value: 'usualGrade'
        },
        {
          text: '考试成绩',
          value: 'examGrade'
        }
      ],
      courseGradeList: []
    }
  },
  mounted () {
    this.getAllGrade()
  },
  methods: {
    getColor (finalGrade) {
      if (finalGrade > 60) return 'green'
      else if (finalGrade === 60) return 'orange'
      else return 'red'
    },
    getAllGrade () {
      this.$axios.post('/grade/get_grades_list')
        .then(res => {
          let courseList = res.data.data
          for (let i = 0; i < res.data.data.length; i++) {
            this.courseGradeList.push({
              courseName: courseList[i].courseName,
              finalGrade: courseList[i].finalGrade,
              examGrade: courseList[i].examGrade,
              usualGrade: courseList[i].usualGrade
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
