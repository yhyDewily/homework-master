<template>
  <div class="person_info">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      style="width: 600px; height: 400px; margin-left: auto; margin-right: auto; margin-top: 20px"
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
      class="mr-4"
      v-show="!changePassword"
      @click="changePassword =! changePassword">
        修改密码
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
    <v-form
      ref="pwd"
      v-model="valid"
      lazy-validation
      style="width: 600px; height: 400px; margin-left: auto; margin-right: auto; margin-top: -150px">
      <v-text-field
        v-model="old_password"
        v-show="changePassword"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show1 = !show1"
        :type="show1 ? 'text' : 'password'"
        :counter="16"
        :rules="passwordRules"
        label="旧密码"
        required
        :disabled="!changePassword"
        placeholder="密码长度在6到16之间"
      ></v-text-field>
      <v-text-field
        v-model="new_password"
        v-show="changePassword"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show2 = !show2"
        :type="show2 ? 'text' : 'password'"
        :counter="16"
        :rules="passwordRules"
        label="新密码"
        required
        :disabled="!changePassword"
        placeholder="密码长度在6到16之间"
      ></v-text-field>
      <v-btn
        color="success"
        class="mr-4"
        v-show="changePassword"
        @click="updatePassword"
      >
        提交
      </v-btn>
      <v-btn
        color="error"
        class="mr-4"
        v-show="changePassword"
        @click="changePassword = false">
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
    show1: false,
    show2: false,
    valid: true,
    changePassword: false,
    old_password: '',
    new_password: '',
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
    ],
    passwordRules: [
      v => (v && v.length >= 6) || '密码过短',
      v => (v && v.length <= 16) || '密码过长'
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
      if (this.$refs.form.validate()) {
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
    },
    updatePassword () {
      if (this.$refs.pwd.validate()) {
        this.$axios.post('/user/update_password.do', this.$qs.stringify({
          oldPassword: this.old_password,
          newPassword: this.new_password
        })).then(res => {
          console.log(res)
          if (res.data.status === 0) {
            this.new_password = ''
            this.old_password = ''
            this.changePassword = false
            window.alert('修改成功')
          } else {
            window.alert(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
