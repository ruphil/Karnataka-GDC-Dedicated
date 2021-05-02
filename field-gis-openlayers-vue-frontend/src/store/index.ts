import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedIn: false
  },
  getters: {
    getLoggedInStatus(state){
      return state.loggedIn;
    }
  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
