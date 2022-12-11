import Vue from 'vue'
import Vuex from 'vuex'
import showTextarea from './showTextarea'
import showCharacter from './showCharacter'
import showModel from './showModel'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    showTextarea,
    showCharacter,
    showModel
  }
})
