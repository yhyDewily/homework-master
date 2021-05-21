<template>
  <div class="course-detail">
    <v-card width="650px">
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
        <v-tab>
          <v-icon left>
            mdi-ballot
          </v-icon>
          课程简介
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-account-supervisor
          </v-icon>
          分组
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-book-outline
          </v-icon>
          资料
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-book-open
          </v-icon>
          作业
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
          <v-card flat v-show="isMember">
            <v-list subheader>
              <v-subheader>组长</v-subheader>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon left>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ group_captain }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider/>
            <v-list subheader>
              <v-subheader>组员</v-subheader>
              <v-list-item v-for="(item, index) in groupMember" :key="index">
                <v-list-item-avatar>
                  <v-icon left>mdi-account-multiple</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
                <v-btn depressed color="error" v-show="isDelete" @click="deleteMember(item)">
                  <v-icon>mdi-cancel</v-icon>
                </v-btn>
                <v-btn depressed color="success" v-show="chooseCaptain" @click="assignCaptain(item)">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-row
              style="margin-bottom: 20px; margin-top: 20px"
            >
              <v-btn class="mx-2" depressed color="primary" v-show="isCaptain && !chooseCaptain" @click="chooseCaptain=!chooseCaptain">让出组长</v-btn>
              <v-btn class="mx-2" depressed color="primary" v-show="chooseCaptain" @click="chooseCaptain = !chooseCaptain">取消</v-btn>
              <v-btn class="mx-2" depressed v-show="!isDelete && groupMember.length!==0 && isCaptain" @click="isDelete = !isDelete">删除成员</v-btn>
              <v-btn class="mx-2" depressed v-show="isDelete" @click="isDelete = !isDelete">取消</v-btn>
              <v-dialog
                v-model="dialog"
                persistent
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    color="error"
                    v-bind="attrs"
                    v-on="on"
                    v-show="isCaptain"
                  >
                    解散小组
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">
                    确定要解散小组吗？
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="dialog = false"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      color="error"
                      text
                      @click="expireGroup"
                    >
                      确定
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn class="mx-2" depressed color="error" @click="exitGroup">退出小组</v-btn>
            </v-row>
          </v-card>
          <div v-show="!isMember">
            <v-card-text >
              <p class="text-h5">未加入任何小组，你可以选择</p>
            </v-card-text>
            <v-row style="margin-left: 2px">
              <v-btn class="mx-2" depressed color="primary" @click="getCourseGroup">加入小组</v-btn>
              <v-btn class="mx-2" depressed color="success" @click="createGroup">创建小组</v-btn>
            </v-row>
          </div>
          <div v-show="chooseGroup" style="margin-top: 10px">
            <v-card-text>
              <p class="text--primary">选择要加入的小组</p>
            </v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">小组名</th>
                  <th class="text-left">组长</th>
                  <th class="text-left">人数</th>
                  <th class="text-left">加入该组</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in groupList" :key="index" >
                  <td>{{ item.groupName }}</td>
                  <td>{{ item.captain }}</td>
                  <td>{{ item.size }}</td>
                  <td>
                    <v-btn x-small color="success" @click="joinGroup(item.id, index)">加入</v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-list dense>
              <v-subheader>课堂资料</v-subheader>
              <v-list-item></v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
              </p>
            </v-card-text>
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
      dialog: false,
      isMember: false,
      isCaptain: false,
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
      groupList: []
    }
  },
  mounted () {
    this.getCourseDetail()
    this.getGroupMember()
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
    joinGroup (val, groupId) {
      console.log(val)
      this.$axios.post('/group/join_group.do', this.$qs.stringify({
        groupId: val
      })).then(res => {
        console.log(res)
        this.group_captain = res.data.data.captain
        this.groupMember = res.data.data.member
        this.groupName = res.data.data.name
        this.groupSize = res.data.data.size
        this.isMember = true
        this.chooseGroup = false
        this.isCaptain = res.data.data.isCaptain
        let captain = this.group_captain
        this.groupMember.forEach(function (item, index, arr) {
          if (item === captain) {
            arr.splice(index, 1)
          }
        })
      })
    },
    assignCaptain (name) {
      this.$axios.post('/group/assign_captain.do', this.$qs.stringify({
        studentName: name,
        courseId: this.$route.params.id
      })).then(res => {
        console.log(res)
        if (res.data.status === 0) {
          this.getGroupMember()
          this.chooseCaptain = false
        }
      })
    },
    deleteMember (name) {
      this.$axios.post('/group/del_member.do', this.$qs.stringify({
        studentName: name,
        courseId: this.$route.params.id
      })).then(res => {
        if (res.data.status === 0) {
          this.getGroupMember()
          this.isDelete = false
        }
      })
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
