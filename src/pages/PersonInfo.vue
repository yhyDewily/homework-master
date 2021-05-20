<template>
  <div class="person_info">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      style="width: 600px; height: 400px; position: absolute; left: 5%;top: 5%"
    >
      <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
        :disabled="!modify"
        placeholder="请输入真实姓名以方便和同学老师沟通"
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
        :disabled="!modify"
      ></v-text-field>
      <v-btn
        color="success"
        class="mr-4"
        v-show="!modify"
        @click="modify=true"
      >
        修改信息
      </v-btn>

      <v-btn
        color="success"
        class="mr-4"
        v-show="modify"
        @click="submitModify"
      >
        提交
      </v-btn>
      <v-btn
      color="error"
      class="mr-4"
      v-show="modify"
      @click="cancelModify">
        取消
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'PersonInfo',
  computed: {
    ...mapState(
      ['username']
    )
  },
  data: () => ({
    valid: true,
    modify: false,
    old_name: '',
    old_email: '',
    name: '',
    email: '',
    nameRules: [
      v => !!v || '用户名不可为空',
      v => (v && v.length <= 10) || '用户名长度必须小于10'
    ],
    emailRules: [
      v => !!v || 'email不可为空',
      v => /.+@.+\..+/.test(v) || '必须为有效邮箱'
    ]
  }),
  mounted () {
    this.getUserInfo()
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    getUserInfo () {
      this.$axios.post('/user/get_user_info.do')
        .then(res => {
          console.log(res)
          this.name = res.data.data.name
          this.email = res.data.data.mail
          this.old_name = res.data.data.name
          this.old_email = res.data.data.mail
        })
    },
    cancelModify () {
      this.getUserInfo()
      this.modify = false
    },
    submitModify () {
      this.$refs.form.validate()
      let name = this.name
      let email = this.email
      if (name === this.old_name || email === this.old_email) {
        window.alert('信息未修改')
        this.modify = false
        return
      }
      this.$axios.post('/user/update_user_info.do', this.$qs.stringify({
        name: name,
        mail: email
      })).then(res => {
        console.log(res)
        if (res.data.status === 0) {
          window.alert('修改信息成功')
          this.getUserInfo()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
