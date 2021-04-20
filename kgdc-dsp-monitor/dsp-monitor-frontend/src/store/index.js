import { createStore } from 'vuex'

export default createStore({
  state: {
    // wsurl: 'ws://59.88.201.244:4010',
    wsurl: 'ws://localhost:4010',
  },
  getters: {
    getWSURL: state => {
      return state.wsurl;
    },
  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
