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

};
