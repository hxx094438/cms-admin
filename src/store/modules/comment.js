/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2019/9/6
*/

import { success, error } from '../../utils/resp'
import service from '../../api'



const state = {
  posting: false,
  fetch: false,
  list: [],
  total: 0
}

const actions = {

  async GET_COMMENTS (
    { commit },
    params
  ) {
    commit('REQUEST_LIST')
    const res = await service.getComments(params)
    const {data, message, code} = res
    if (code === 0) {
      const list = data.map((item ) => {
        return { ...item, deleteing: false }
      })
      const total = data.length
      commit('REQUEST_LIST_SUCCESS', { list, total })
    } else commit('REQUEST_LIST_FAIL')
    return res
  },

  // 修改评论
  async PUT_COMMENT (
    { commit },
    comment
  ) {
    commit('POSTING_COMMENT')
    const res = await service.putComment(comment)
    const {data, message, code} = res
    if (code === 0) {
      success('修改成功')
      commit('PUT_COMMENT_SUCCESS', comment)
    } else error(res.message)
    commit('POSTING_COMMENT_FINAL')
    return res
  },

  // 删除
  async DEL_COMMENT (
    { commit },
    comment
  ) {
    commit('DELETE_COMMENT', comment)
    const res = await service.deleteComment(comment)
    const {data, message, code} = res
    if (code === 0) success('删除成功')
    else error(res.message)
    commit('DELETE_COMMENT_FINAL', comment)
    return res
  }
}

const mutations = {
  'REQUEST_LIST' (state) {
    state.fetch = true
  },

  'REQUEST_LIST_SUCCESS' (
    state,
    payload
  ) {
    state.fetch = false
    state.list = payload.list
    state.total = payload.total
  },

  'REQUEST_LIST_FAIL' (state) {
    state.fetch = false
    state.list = []
    state.total = 0
  },

  'DELETE_COMMENT' (
    state,
    comment
  ) {
    (state.list.find((item) => item.id === comment.id) ).deleteing = true
  },

  'DELETE_COMMENT_FINAL' (
    state,
    comment
  ) {
    (state.list.find((item) => item.id === comment.id)).deleteing = false
    let index = state.list.findIndex((item => item.id === comment.id))
    state.list.splice(index,1)
  },

  'POSTING_COMMENT' (
    state
  ) {
    state.posting = true
  },

  'POSTING_COMMENT_FINAL' (
    state
  ) {
    state.posting = false
  },

  'PUT_COMMENT_SUCCESS' (
    state,
    comment
  ) {
    (
      state.list.find((item) => item._id === comment._id)
    ).state = comment.state
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
