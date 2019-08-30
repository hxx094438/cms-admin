import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './state.js';
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'
import articles from './modules/articles'
import tag from './modules/tag'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: defaultState,
  getters,
  actions,
  mutations,
  modules: {
    articles,
    tag,
  }
})

if (module.hot) {
  module.hot.accept([
    './state',
    './mutations',
    './actions',
    './getters',
    './modules/articles',
    './modules/tag',
  ], () => {
    const newState = require('./state').default;
    const newMutations = require('./mutations').default;
    const newActions = require('./actions').default;
    const newGetters = require('./getters').default;
    store.hotUpdate({
      state: newState,
      mutations: newMutations,
      getters: newGetters,
      actions: newActions,
      modules: {
        articles,
        tag,
      }
    });
  });
}
export default store




