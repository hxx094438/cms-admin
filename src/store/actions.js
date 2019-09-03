import service from '../api'
import { success, error } from '../utils/resp'

export default {
  // 获取 qn token
  async GET_QINIU ({ commit }) {
    const res = await service.getQiniu()
    if (res && res.code === 1) commit('QN_TOKEN', res.result.token)
  },

};
