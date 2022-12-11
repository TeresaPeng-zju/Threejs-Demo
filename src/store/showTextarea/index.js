export default {
  namespaced: true,
  state: {
    isSelected: false
  },
  getters: {
  },
  mutations: {
    chanIsSelected(state, payload) {
      state.isSelected = payload
    }
  },
  actions: {
  },
  modules: {
  }
}