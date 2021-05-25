<template>
  <div class="forum-detail">
    <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-text>
        <div>{{ creator }}</div>
        <p class="display-1 text--primary">
          {{ title }}
        </p>
        <v-btn color="error"
               style="float: right; position: relative" v-show="role === '1'"
               @click="dialog=true"
        >删除该贴</v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">确定要删除该贴吗？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
              <v-btn color="blue darken-1" text @click="delQuestion">确定</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <p>发帖时间：{{ time }}</p>
        <div class="headline text--primary">
          {{ content }}
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>{{ count }}个回复</v-card-text>
      <v-divider></v-divider>
      <v-container>
        <p v-show="commentList.length === 0">暂无回复，去添加回复吧</p>
        <v-data-iterator
          :items="commentList"
          hide-default-footer
          v-show="commentList.length !== 0"
        >
          <template v-slot:default="props">
            <v-row
              v-for="(item) in props.items"
              :key="item.id"
            >
              <v-card width="1000px" tile>
                <v-card-text>
                  <div>{{ item.commentator }}</div>
                  <div class="caption">回复时间：{{ item.time }}</div>
                  <p class="title text--primary">{{ item.content }}</p>
                  <v-spacer></v-spacer>
<!--                  <v-row>-->
<!--                    <v-btn color="grey" text @click="showSubComment(index)">-->
<!--                      <v-icon>mdi-chat</v-icon>-->
<!--                      <p class="caption">{{ item.subComment.length }}</p>-->
<!--                    </v-btn>-->
<!--                  </v-row>-->
                </v-card-text>
              </v-card>
<!--                <div v-show="item.isShow" >-->
<!--                  <v-row-->
<!--                    v-for="(comment, ind) in subComments"-->
<!--                    :key="ind"-->
<!--                  >-->
<!--                    <v-card style="width: 1000px;" tile>-->
<!--                      <v-card-text>-->
<!--                        <div>{{ comment.commentator }}</div>-->
<!--                        <div class="caption">回复时间：{{ comment.time }}</div>-->
<!--                        <p class="text&#45;&#45;primary">{{ comment.content }}</p>-->
<!--                      </v-card-text>-->
<!--                    </v-card>-->
<!--                  </v-row>-->
<!--                  <v-text-field solo label="评论"-->
<!--                                  v-model="comment"-->
<!--                                  append-icon="mdi-check"-->
<!--                                  clearable-->
<!--                                  @click:append="submitComment(item.id)"></v-text-field>-->
<!--                </div>-->
            </v-row>
          </template>
        </v-data-iterator>
        <v-subheader class="title text--primary" style="margin-top: 10px">提交回复</v-subheader>
        <v-divider></v-divider>
        <v-textarea
          v-model="answer"
          label="参与讨论"></v-textarea>
        <v-btn color="primary"
        @click="submitAnswer">
          提交
        </v-btn>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ForumDetail',
  data () {
    return {
      answer: '',
      dialog: false,
      questionId: '',
      title: '',
      creator: '',
      time: '',
      count: 0,
      content: '',
      comment: '',
      role: '',
      commentList: [],
      subComments: []
    }
  },
  mounted () {
    this.getQuestionDetail()
  },
  methods: {
    getQuestionDetail () {
      this.role = localStorage.getItem('role')
      this.questionId = this.$route.params.id
      this.$axios.post('/forum/get_question_by_id', this.$qs.stringify({
        questionId: this.questionId
      })).then(res => {
        console.log(res)
        this.creator = res.data.data.creator
        this.content = res.data.data.content
        this.title = res.data.data.title
        this.count = res.data.data.commentCount
        this.commentList = res.data.data.commentList
        this.commentList.forEach(item => {
          this.$set(item, 'isShow', false)
        })
        this.time = res.data.data.time
      })
    },
    showSubComment (val) {
      this.commentList[val].isShow = !this.commentList[val].isShow
      this.subComments = []
      this.subComments = this.commentList[val].subComment
    },
    submitComment (val) {
      console.log(val)
    },
    submitAnswer () {
      if (this.answer === '') return
      this.$axios.post('/forum/submit_answer', this.$qs.stringify({
        questionId: this.questionId,
        content: this.answer
      })).then(res => {
        if (res.data.status === 0) {
          window.alert('回复成功')
          this.getQuestionDetail()
        }
      })
    },
    delQuestion () {
      this.$axios.post('/forum/delete_question', this.$qs.stringify({
        id: this.questionId
      })).then(res => {
        console.log(res)
        if (res.data.status === 0) {
          window.alert('删除成功')
          this.dialog = false
          this.$router.push('/teacher_home/teacher_forum')
        } else {
          window.alert('删除失败')
          this.dialog = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
