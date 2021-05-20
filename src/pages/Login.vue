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
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="密码"
                    name="password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
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
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'email不可为空',
        v => v => /.+@.+\..+/.test(v) || '必须为有效邮箱'
      ]
    }
  },
  methods: {
    login () {
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
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style scoped>

</style>
