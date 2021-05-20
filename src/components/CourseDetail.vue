<template>
  <div class="course-detail">
    课程详情
  </div>
</template>

<script>
export default {
  name: 'CourseDetail',
  data () {
    return {
      courseId: '',
      courseName: '',
      teacher: '',
      major: '',
      stopTime: ''
    }
  },
  mounted () {
    this.getCourseDetail()
  },
  methods: {
    getCourseDetail () {
      this.$axios.post('/course/get_course_info_by_id.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
