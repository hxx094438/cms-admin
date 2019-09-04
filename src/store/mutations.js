export default {
  // 设置页面标题
  QN_TOKEN: (state, token) => {
    console.log('committoken',token)
    state.QNtoken = token
  },

}
