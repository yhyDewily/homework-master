<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/course">
          <v-list-item-action>
            <v-icon>mdi-cart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>课程管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/person_info">
          <v-list-item-action>
            <v-icon>mdi-account-box-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>我的信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/grade">
          <v-list-item-action>
            <v-icon>mdi-layers-triple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>成绩管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/forum">
          <v-list-item-action>
            <v-icon>mdi-folder-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>我的发帖</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>你好{{ name }}! 欢迎来到课程管理系统</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">注销</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Home',
  data: () => ({
    drawer: null,
    name: ''
  }),
  computed: {
    ...mapState(
      ['username']
    )
  },
  mounted () {
    if (this.$cookie.get('userId')) {
      this.getUser()
    }
  },
  methods: {
    getUser () {
      this.$axios.post('/user/get_user_info.do')
        .then(res => {
          console.log(res)
          this.name = res.data.data.name
        })
    },
    logout () {
      this.$cookie.set('userId', '', {expires: '-1'})
      localStorage.clear()
      this.$store.dispatch('saveUserName', '')
      this.$axios.post('/user/logout.do')
        .then(res => {
          console.log(res)
        })
      window.alert('成功注销')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
