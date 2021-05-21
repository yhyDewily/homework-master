<template>
  <div class="course-detail">
    <v-card>
      <v-toolbar
        flat
        color="primary"
        dark
      >
        <v-toolbar-title>{{ courseName }}({{ courseId }})</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          分组
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          资料
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-lock
          </v-icon>
          作业
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-access-point
          </v-icon>
          成绩
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-list subheader>
              <v-subheader>组长</v-subheader>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon left>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>刘谕鸿</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider/>
            <v-list subheader>
              <v-subheader>组员</v-subheader>
              <v-list-item></v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
              </p>

              <p>
                Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
              </p>

              <p>
                Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
              </p>

              <p>
                Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
              </p>

              <p class="mb-0">
                Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
              </p>

              <p class="mb-0">
                Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
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
      stopTime: '',
      groupMember: []
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
        this.courseId = res.data.data.courseId
        this.courseName = res.data.data.courseName
        this.teacher = res.data.data.teacher
        this.major = res.data.data.major
        this.stopTime = res.data.data.stopTime
      })
    }
  }
}
</script>

<style scoped>

</style>
