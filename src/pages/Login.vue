<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>登录</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation>
                  <v-text-field
                    label="邮箱"
                    name="login"
                    prepend-icon="mdi-account"
                    v-model="email"
                    :rules="emailRules"
                    type="text"
                    required
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="密码"
                    name="password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    :rules="passwordRules"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="390"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      text
                    >
                      没有账号？点击注册
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">
                      注册账号
                    </v-card-title>
                    <v-form
                      style="width: 80%; margin-right: auto; margin-left: auto"
                      ref="reg">
                      <v-text-field
                        v-model="newUser.username"
                        :counter="10"
                        :rules="nameRules"
                        label="用户名"
                        required
                        placeholder="请输入真实姓名以方便和同学老师沟通"
                      ></v-text-field>
                      <v-text-field
                        v-model="newUser.email"
                        :rules="emailRules"
                        label="邮箱"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="newUser.email"
                        :counter="16"
                        :rules="passwordRules"
                        label="密码"
                        required
                      ></v-text-field>
                      <v-radio-group
                      v-model="newUser.role"
                      row>
                        <v-radio
                        label="学生"
                        value= 0
                        ></v-radio>
                        <v-radio
                        label="教师"
                        value=1>
                        </v-radio>
                      </v-radio-group>
                    </v-form>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        @click="dialog = false"
                      >
                        取消
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="register"
                      >
                        注册
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-btn color="primary" @click="login">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      valid: true,
      dialog: false,
      newUser: {
        username: '',
        password: '',
        email: '',
        role: null
      },
      email: '',
      password: '',
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
    }
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        let email = this.email
        let password = this.password
        this.$axios.post('/user/login.do', this.$qs.stringify({
          email: email,
          password: password
        })).then(res => {
          console.log(res)
          if (res.data.status === 0) {
            this.$cookie.set('userId', res.data.data.id, {expires: 'Session'})
            localStorage.setItem('isLogin', '1')
            this.$store.dispatch('saveUserName', res.data.data.username)
            this.$router.push({
              name: 'Home',
              params: {
                from: 'login'
              }
            })
          } else if (res.data.status === 1) {
            window.alert(res.data.msg)
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        window.alert('请输入完整信息')
      }
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    register () {
      if (this.$refs.reg.validate()) {
        this.$axios.post('', this.$qs.stringify({
          name: this.newUser.username,
          password: this.newUser.password,
          mail: this.newUser.email,
          role: this.newUser.role
        })).then(res => {
          if (res.data.status === 0) {
            this.newUser = {}
            window.alert(res.data.msg)
            this.dialog = false
          } else {
            window.alert(res.data.msg)
            this.dialog = false
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
