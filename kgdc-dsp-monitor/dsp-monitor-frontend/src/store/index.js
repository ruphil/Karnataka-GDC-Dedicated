import { createStore } from 'vuex'

export default createStore({
  state: {
    // wssurl: 'ws://59.88.201.244:4010',
    wssurl: 'ws://localhost:4010',
  },
  getters: {
    getWSSURL: state => {
      return state.wssurl;
    },
  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
