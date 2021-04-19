import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: false,
    user: '',
    pass: '',
    wsServerURL: 'ws://localhost:3010'
  },
  getters: {
    getIsLoggedIn: state => {
      return state.isLoggedIn;
    },
    getWSURL: state => {
      return state.wsServerURL;
    },
    getUser: state => {
      return state.user;
    },
    getPass: state => {
      return state.pass;
    }
  },
  mutations: {
    setUser(state, payload){
      state.user = payload;
    },
    setPass(state, payload){
      state.pass = payload;
    },
    setLoggedInStatusToTrue(state){
      state.isLoggedIn = true;
    }
  },
  actions: {
    setUser(context, payload){
      context.commit('setUser', payload);
    },
    setPass(context, payload){
      context.commit('setPass', payload);
    },
    setLoggedInStatusToTrue(context){
      context.commit('setLoggedInStatusToTrue');
    }
  },
  modules: {
  }
})
