import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: false
  },
  getters: {
    getLoggedInStatus(state) {
      return state.isLoggedIn;
    }
  },
  mutations: {
    setLoggedInStatus(state, isLoggedIn){
      state.isLoggedIn = isLoggedIn;
    },
  },
  actions: {
    setLoggedInStatus(context, isLoggedIn){
      context.commit('setLoggedInStatus', isLoggedIn);
    },
  }
})
