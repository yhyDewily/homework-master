<template>
  <div class="course-detail">
    <v-card width="800px">
      <v-toolbar
        flat
        color="primary"
        dark
      >
        <v-toolbar-title>{{ courseName }}({{ courseId }})</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title v-show="isMember">{{ groupName }}</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
<!--        课程简介-->
        <v-tab>
          <v-icon left>
            mdi-ballot
          </v-icon>
          课程简介
        </v-tab>
<!--        小组管理-->
        <v-tab>
          <v-icon left>
            mdi-account-supervisor
          </v-icon>
          分组管理
        </v-tab>
<!--        资料管理-->
        <v-tab>
          <v-icon left>
            mdi-book-outline
          </v-icon>
          资料上传
        </v-tab>
<!--        作业管理-->
        <v-tab>
          <v-icon left>
            mdi-book-open
          </v-icon>
          作业查看
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-book
          </v-icon>
          成绩管理
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-text>
              <div>{{ major }}</div>
              <p class="display-1 text--primary">{{ courseName }}</p>
              <p>任课教师：{{ teacher }}</p>
              <div class="text--primary">
                {{ intro }}
              </div>
              <p style="margin-top: 10px">结课时间：{{ stopTime }}</p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-data-table
            :headers="group_headers"
            :items="groupList"
            class="elevation-1"
          >
            <template v-slot:top>
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">查看小组成员</span>
                    </v-card-title>
                    <v-list v-for="(item, index) in groupMember" :key="index">
                      <v-list-item two-line style="margin-left: 20px">
                        <v-list-item-content>
                          <v-list-item-title v-text="item"></v-list-item-title>
                          <v-list-item-subtitle v-show="item === group_captain">组长</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                      >
                        确定
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="headline">确定要解散该小组吗？</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialogDelete = false">取消</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteSubmit">确定</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="checkGroup(item)"
              >
                mdi-account
              </v-icon>
              <v-icon
              small
              class="mr-2"
              @click="deleteGroup(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-form ref="cou_file" style="margin-top: 20px">
              <v-file-input
                style="width: 60%;"
                counter
                label="File input"
                clearable
                v-model="material"
              ></v-file-input>
              <v-btn @click="uploadFile" color="success">上传</v-btn>
            </v-form>
            <v-divider style="margin-top: 10px"></v-divider>
            <v-subheader>课堂资料</v-subheader>
            <v-data-table
            :headers="material_headers"
            :items = "course_material"
            :search="keyword"
            >
              <template v-slot:item.actions = "{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="download_material(item)"
                >mdi-arrow-down</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                课堂作业
              </p>
            </v-card-text>
            <v-data-table
              :headers="homework_headers"
              :items = "course_homework"
              :search="keyword"
              dense
            >
              <template v-slot:item.actions = "{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="download_homework(item)"
                >mdi-arrow-down</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-data-table
              :headers="gradeHeader"
              :items="gradeList"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-dialog
                  v-model="dialogGrade"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">修改学生成绩</span>
                    </v-card-title>
                    <v-form ref="grade"
                            lazy-validation
                            style="width: 60%; margin-right: auto; margin-left: auto">
                      <v-text-field
                      label="平时成绩"
                      :rules="gradeRules"
                      v-model="editGradeItem.usualGrade"
                      ></v-text-field>
                      <v-text-field
                        label="考试成绩"
                        :rules="gradeRules"
                        v-model="editGradeItem.examGrade"
                      ></v-text-field>
                    </v-form>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        @click="dialogGrade=false"
                      >
                        取消
                      </v-btn>
                      <v-btn
                        color="success"
                        text
                        @click="editGrade"
                      >
                        保存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="editSubmit(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
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
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'CourseDetail',
  computed: {
    ...mapState(
      ['username']
    )
  },
  data () {
    return {
      material: [],
      dialog: false,
      dialogDelete: false,
      dialogGrade: false,
      deleteId: -1,
      keyword: '',
      isMember: false,
      isCaptain: false,
      isTeacher: false,
      isDelete: false,
      chooseGroup: false,
      chooseCaptain: false,
      courseId: '',
      courseName: '',
      teacher: '',
      major: '',
      intro: '',
      stopTime: '',
      groupName: '',
      groupSize: 0,
      group_captain: '',
      groupMember: [],
      groupList: [],
      group_headers: [
        {
          text: '小组名',
          align: 'start',
          sortable: true,
          value: 'groupName'
        },
        {text: '组长', value: 'captain'},
        {text: '人数', value: 'size'},
        {text: '查看', value: 'actions', sortable: false}
      ],
      course_material: [],
      course_homework: [],
      material_headers: [
        {
          text: '文件名',
          align: 'start',
          sortable: true,
          value: 'fileName'
        },
        {text: '上传者', value: 'teacherName'},
        {text: '上传日期', value: 'time'},
        {text: '下载', value: 'actions'}
      ],
      homework_headers: [
        {
          text: '文件名',
          align: 'start',
          sortable: true,
          value: 'fileName'
        },
        {text: '上传者', value: 'studentName'},
        {text: '上传日期', value: 'time'},
        {text: '下载', value: 'actions'}
      ],
      gradeHeader: [
        {
          text: '姓名',
          align: 'start',
          value: 'studentName'
        },
        {text: '总分', value: 'finalGrade'},
        {text: '平时成绩', value: 'usualGrade'},
        {text: '考试成绩', value: 'examGrade'},
        {text: '录入成绩', value: 'actions'}
      ],
      gradeList: [],
      editGradeItem: {
        studentId: 0,
        usualGrade: 0,
        examGrade: 0
      },
      gradeRules: [
        v => !!v || '不可为空',
        v => /^[0-9]*$/.test(v) || '输入必须为数字'
      ]
    }
  },
  mounted () {
    this.getCourseDetail()
    this.getGroupMember()
    this.getCourseGroup()
    this.getMaterial()
    this.getHomework()
    this.getAllStuGrade()
  },
  methods: {
    getColor (finalGrade) {
      if (finalGrade > 60) return 'green'
      else if (finalGrade === 60) return 'orange'
      else return 'red'
    },
    uploadFile () {
      if (this.material.length === 0) return
      var formData = new FormData()
      formData.append('file', this.material)
      this.$axios.post('/file/upload_material', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
          if (res.data.status === 0) {
            window.alert('上传成功')
            this.material = []
            this.getMaterial()
          }
        })
    },
    getMaterial () {
      this.$axios.post('/file/get_all_materials', this.$qs.stringify({
        userId: this.$cookie.get('userId')
      }))
        .then(res => {
          this.course_material = res.data.data
        })
    },
    getHomework () {
      this.$axios.post('/file/get_received_homeworks')
        .then(res => {
          this.course_homework = res.data.data
        })
    },
    download_material (item) {
      this.$axios.get('/file/download_material', {
        params: {
          fileName: item.fileName
        },
        responseType: 'blob'
      })
        .then(res => {
          if (!res.data) {
            return
          }
          const blob = new Blob([res.data], {type: 'application/octet-stream'})
          console.log(blob)
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = item.fileName
          a.click()
          URL.revokeObjectURL(a.href)
          a.remove()
        })
    },
    download_homework (item) {
      this.$axios.get('/file/download_homework', {
        params: {
          fileName: item.fileName
        },
        responseType: 'blob'
      })
        .then(res => {
          if (!res.data) {
            return
          }
          const blob = new Blob([res.data], {type: 'application/octet-stream'})
          console.log(blob)
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = item.fileName
          a.click()
          URL.revokeObjectURL(a.href)
          a.remove()
        })
    },
    getCourseDetail () {
      this.$axios.post('/course/get_course_info_by_id.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        this.courseId = res.data.data.courseId
        this.courseName = res.data.data.courseName
        this.teacher = res.data.data.teacher
        this.major = res.data.data.major
        this.stopTime = res.data.data.stopTime
        this.intro = res.data.data.intro
      })
    },
    getGroupMember () {
      this.$axios.post('/group/get_group_info.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        if (res.data.status === 0) {
          this.group_captain = res.data.data.captain
          this.groupMember = res.data.data.member
          this.groupName = res.data.data.name
          this.groupSize = res.data.data.size
          this.isMember = true
          this.isCaptain = res.data.data.isCaptain
          let captain = this.group_captain
          this.groupMember.forEach(function (item, index, arr) {
            if (item === captain) {
              arr.splice(index, 1)
            }
          })
        }
      })
    },
    deleteGroup (val) {
      this.deleteId = val.id
      this.dialogDelete = true
    },
    deleteSubmit () {
      this.$axios.post('/group/teacher_expire_group.do', this.$qs.stringify({
        courseId: this.deleteId
      })).then(res => {
        console.log(res)
        if (res.data.status === 0) {
          this.getCourseGroup()
          window.alert('解散成功')
        } else {
          window.alert('解散失败')
        }
      })
      this.dialogDelete = false
    },
    checkGroup (group) {
      this.dialog = true
      this.groupMember = group.member
      this.group_captain = group.captain
    },
    createGroup () {
      this.$axios.post('/group/create.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        this.group_captain = res.data.data.captain
        this.groupMember = res.data.data.member
        this.groupName = res.data.data.name
        this.groupSize = res.data.data.size
        this.isMember = true
        this.isCaptain = res.data.data.isCaptain
        let captain = this.group_captain
        this.groupMember.forEach(function (item, index, arr) {
          if (item === captain) {
            arr.splice(index, 1)
          }
        })
      })
    },
    expireGroup () {
      this.$axios.post('/group/expire_group.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        if (res.data.status === 0) {
          this.isMember = false
          this.isCaptain = false
        } else {
          window.alert('解散失败')
        }
      })
      this.dialog = false
    },
    exitGroup () {
      this.$axios.post('/group/exit_group.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        if (res.data.status === 0) {
          this.isMember = false
          this.isCaptain = false
        } else {
          window.alert('退出失败')
        }
      })
      this.dialog = false
    },
    getCourseGroup () {
      this.chooseGroup = !this.chooseGroup
      this.$axios.post('/group/get_all_group.do', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        console.log(res)
        this.groupList = res.data.data
      })
    },
    getAllStuGrade () {
      this.$axios.post('/grade/get_all_stu_grade', this.$qs.stringify({
        courseId: this.$route.params.id
      })).then(res => {
        console.log(res)
        let content = res.data.data
        for (let i = 0; i < content.length; i++) {
          this.gradeList.push({
            studentName: content[i].studentName,
            studentId: content[i].studentId,
            finalGrade: content[i].finalGrade,
            examGrade: content[i].examGrade,
            usualGrade: content[i].usualGrade
          })
        }
      })
    },
    editGrade () {
      this.$axios.post('/grade/modify_grade', this.$qs.stringify({
        courseId: this.$route.params.id,
        studentId: this.editGradeItem.studentId,
        usual: this.editGradeItem.usualGrade,
        exam: this.editGradeItem.examGrade
      })).then(res => {
        if (res.data.status === 0) {
          window.alert('修改成功')
          this.dialogGrade = false
          this.getAllStuGrade()
        } else {
          window.alert('修改失败')
          this.dialogGrade = false
        }
      })
    },
    editSubmit (item) {
      this.dialogGrade = true
      this.editGradeItem.studentId = item.studentId
      this.editGradeItem.usualGrade = item.usualGrade
      this.editGradeItem.examGrade = item.examGrade
    },
    close () {
      this.dialog = false
      this.groupMember = []
      this.group_captain = ''
    },
    save () {
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
