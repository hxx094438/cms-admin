import service from '../../api'
import { success, error } from '../../utils/resp'


export default {
  namespaced: true,
  state: {
    page: 1,
    pageTotal: 0,
    articles: [],
    noMoreData: false,
    defaultLimit: 4,
    article: {},
    articlesLikeArr: [], // 子项为文章aid
    posting: false,
    fetch: false,
    list: [],
    detail: {},
    // detail: {
    //   title: '',
    //   keyword: '',
    //   thumb: '',
    //   state: 0,
    //   publish: 0,
    //   type: 0,
    //   descript: '',
    //   tag: []
    // },
    tags: []
  },
  mutations: {
    SET_POSTS_BASE_INFO (state, data) {
      const {total , articles, page} = data
      console.log('page', page)
      state.articles = articles
      state.noMoreData = page >= total
      // localStorage.setItem('articles',window.JSON.stringify(articles))
    },

    ADD_ARTICLES(state, articles) {
      state.articles = [...state.articles, ...articles]
    },

    SET_ARTICLE(state, article) {
      state.detail = article
      state.fetch = false
    },

    SET_TAGS: (state, tags) => {
      state.tags = tags
    },

    //草稿
    SET_DRAFT: (state, draft) => {
      state.draft = draft
    },

    REQUEST_LIST: (state) => {
      state.fetch = true
    },

    REQUEST_LIST_SUCCESS: (state, payload) => {
      state.fetch = false
      state.list = payload.list
      state.total = payload.total
    },

    REQUEST_LIST_FAIL: (state) => {
      state.fetch = false
      state.list = []
      state.total = 0
    },

    DELETE_ARTICLE: (state, article) => {
      (state.list.find((item) => item._id === article._id)).deleteing = true
    },

    DELETE_ARTICLE_FINAL: (state, article) => {
      (state.list.find((item) => item._id === article._id)).deleteing = false
    },

    PATCH_HERO_SUCCESS: (state, article) => {
      const list = (
        state.list.find((item) => item.aid === article.aid)
      )
      for (const key in article) {
        if (article.hasOwnProperty(key)) {
          list[key] = article[key]
        }
      }
    },

    REQUEST_DETAIL_SUCCESS: (state, article) => {
      state.detail = { ...article }
      state.fetch = false
    },

    REQUEST_DETAIL_FAIL: (state) => {
      state.fetch = false
    },

    POST_ARTICLE: (state) => {
      state.posting = true
    },

    POST_ARTICLE_FINAL: (state) => {
      state.posting = false
    }


  },
  actions: {
    GET_ALL_ARTICLES ({state, commit}, params) {
      return service.getAllArticles(params).then( res => {
        const {data, message, code} = res
        console.log('data',data,code)
        if( code === 0) {
          state.list = data.articles.map( item => {
            return {...item , deleteing: false}
          })
          state.total = data.total
          commit('REQUEST_LIST_SUCCESS', { list:state.list
            , total: state.total
          })
        } else {
          commit('REQUEST_LIST_FAIL')
        }
        return res
      })
    },

    GET_TAGS ( {state, commit}, params) {
      return service.getTags(params).then( res => {
        const {data, message, code} = res
        if( code === 0) {
          commit('SET_TAGS', data)
        }
        return res
      })
    },


    DEL_ARTICLE({dispatch}, payload) {
      return service.delArticle(payload.aid)
        .then(() => {
          const {data, message} = res
          if( data.code === 0) {
            if (payload.route.name === 'posts') dispatch('GET_ALL_ARTICLES', {page: payload.page, limit: 4})
            if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
            if (payload.route.name === 'search') router.push({name: 'posts'})
          }

        }).catch((err) => {
          console.log(err)
        })
    },


    GET_ARTICLE({commit, state}, aid) {
      return service.getArticle(aid)
        .then(res => {
          const {data, message} = res
          if( data.code === 0) {
            commit('SET_ARTICLE', data)
          }
          // commit('set_headline', {content: state.article.title, animation: 'animated rotateIn'})
          // document.title = state.article.title
          // endLoading(commit, startTime, 'isLoading_toggle')
        }).catch((err) => {
          console.log(err)
        })
    },


    SAVE_ARTICLE({state, commit}, payload) {
      return service.saveArticle({article: state.article, ...payload})
        .then(() => {
          const {data, message} = res
          if( data.code === 0) {
            console.log('保存成功')
          }
          // commit('isSaving_toggle', true)
          // commit('isSend_toggle', true)
        }).catch((err) => {
          console.log(err)
        })
      // }
    },

    UPDATE_ARTICLE_LIKE_ARR({state, commit}, payload) {
      commit('UPDATE_ARTICLE_LIKE',payload)
    },

    // 改变状态
    async PATCH_ARTICLE (
      { commit },
      params
    ) {
      console.log('PATCH_ARTICLE',params)
      const res = await service.patchArt(params)
      if (res && res.code === 0) {
        success('修改成功')
        commit('PATCH_HERO_SUCCESS', params.article)
      } else error(res.message)
      return res
    },


  }
};
