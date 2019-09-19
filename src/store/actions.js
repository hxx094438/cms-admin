import service from '../api'
import { success, error } from '../utils/resp'

export default {
  // 获取 qn token
  async GET_QINIU ({ commit }) {
    return service.getQiniu()
    .then(res => {
      const {code, data} = res
      if (code === 0) commit('QN_TOKEN', data.token)
    })
  },

  //登录
  async login (
    { commit },
    user
  ) {
    commit('USER_LOGINING')
    const res = await service.login({ ...user })
    console.log('res',res)
    if (res.code === 0) {
      window.localStorage.setItem('TOKEN', JSON.stringify(res.result))
      success('登录成功')
    } else {
      error(res.message)
    }
    commit('USER_LOGINING_FINAL')
    return res
  },

    // 用户信息初始化
    async initAuth ({ commit }) {
      const res = await service.getAuth()
      if (res && res.code === 1) commit('USER_INFO', res.result)
    },

    // 修改用户信息
  async putAuth (
    { commit },
    user
  ) {
    commit('POST_USER_INFO')
    const res = await service.putAuth({ ...user })
    if (res && res.code === 1) success('修改用户信息成功')
    else error(res.message)
    commit('POST_USER_FINAL')
    return res
  },

  // 获取网站信息
  async getOpt ({ commit }) {
    const res = await service.getOpt()
    if (res && res.code === 1) commit('OPTION_INFO', res.result)
  },

  // 修改网站信息
  async putOpt (
    { commit },
    option
  ) {
    commit('POST_OPTION_INFO')
    const res = await service.putOpt({ ...option })
    if (res && res.code === 1) success('修改成功')
    else error(res.message)
    commit('POST_OPTION_FINAL')
    return res
  },

};
