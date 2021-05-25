export default {
  saveUserName (context, username) {
    context.commit('saveUserName', username)
  },
  saveUserId (context, userId) {
    context.commit('saveUserId', userId)
  },
  saveUserRole (context, role) {
    context.commit('saveUserRole', role)
  }
}
