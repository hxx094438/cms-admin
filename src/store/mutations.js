export default {
  // 设置页面标题
  QN_TOKEN: (state, token) => {
    console.log('committoken',token)
    state.QNtoken = token
  },

  'USER_LOGINING' (state) {
    state.login = true
  },

  'USER_LOGINING_FINAL' (state) {
    state.login = false
  },

  'USER_INFO' (state, user) {
    state.user = user
  },

}
