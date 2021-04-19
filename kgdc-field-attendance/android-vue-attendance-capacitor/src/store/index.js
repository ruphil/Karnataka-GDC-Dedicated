import { createStore } from 'vuex'

export default createStore({
  state: {
    name: '',
    mobilenumber: '',
    password: '',
    wsServerURL: 'ws://192.168.1.200:3010',
    dataURL: 'https://raw.githubusercontent.com/daw-kgdc/file-host-permanent/main/vue-attendance-register/app.data',
  },
  getters: {
    getDataURL: state => {
      return state.dataURL;
    },
    getWSURL: state => {
      return state.wsServerURL;
    },
    getName: state => {
      return state.name;
    },
    getMobileNumber: state => {
      return state.mobilenumber;
    },
    getPassword: state => {
      return state.password;
    }
  },
  mutations: {
    setWSURL(state, payload){
      state.wsServerURL = payload;
    },
    setName(state, payload){
      state.name = payload;
    },
    setMobile(state, payload){
      state.mobilenumber = payload;
    },
    setPass(state, payload){
      state.password = payload;
    }
  },
  actions: {
    setWSURL(context, payload){
      context.commit('setWSURL', payload);
    },
    setName(context, payload){
      context.commit('setName', payload);
    },
    setMobile(context, payload){
      context.commit('setMobile', payload);
    },
    setPass(context, payload){
      context.commit('setPass', payload);
    }
  },
  modules: {
  }
})
