<template>
  <div class="forum">
    <v-card>
      <v-card-title>
        讨论区
        <v-dialog
          v-model="dialog"
          max-width="1000px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mx-2"
              v-bind="attrs"
              v-on="on"
            >
              发起讨论
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">发布新讨论</span>
            </v-card-title>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              style="width: 80%; margin-left: auto; margin-right: auto"
            >
              <v-text-field
                v-model="newQuestion.title"
                :counter="30"
                :rules="titleRules"
                label="标题"
                required
              >
              </v-text-field>
              <v-textarea
                counter
                v-model="newQuestion.content"
                label="请输入具体内容"
                :rules="contentRules"
                :value="newQuestion.content"
              ></v-textarea>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog=false"
              >
                取消
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="publishQuestion"
              >
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        :items="questionList"
        :search="search"
        item-key="id"
        @click:row="goToDetail"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Forum',
  data () {
    return {
      dialog: false,
      search: '',
      valid: true,
      headers: [
        {
          text: '标题',
          align: 'start',
          sortable: 'false',
          value: 'title'
        },
        {
          text: '发帖人',
          value: 'creator'
        },
        {
          text: '发帖时间',
          value: 'time'
        },
        {
          text: '回帖数',
          value: 'count'
        }
      ],
      newQuestion: {
        title: '',
        content: ''
      },
      titleRules: [
        v => !!v || '请输入标题',
        v => (v && v.length <= 30) || '标题字数不得超过30'
      ],
      contentRules: [
        v => !!v || '请输入内容',
        v => (v && v.length >= 10) || '问题字数不得小于10'
      ],
      questionList: []
    }
  },
  mounted () {
    this.getAllQuestions()
  },
  methods: {
    getAllQuestions () {
      this.$axios.post('/forum/get_all_questions')
        .then(res => {
          console.log(res)
          let questions = res.data.data
          for (let i = 0; i < questions.length; i++) {
            this.questionList.push({
              id: questions[i].id,
              title: questions[i].title,
              creator: questions[i].creator,
              time: questions[i].time,
              count: questions[i].commentCount
            })
          }
        })
    },
    goToDetail (val) {
      this.$router.push('/question_detail/' + val.id)
    },
    publishQuestion () {
      this.$axios.post('/forum/publish_question', this.$qs.stringify({
        title: this.newQuestion.title,
        content: this.newQuestion.content
      })).then(res => {
        if (res.data.status === 0) {
          this.dialog = false
          this.questionList = []
          this.getAllQuestions()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
