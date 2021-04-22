import { createStore } from 'vuex'

export default createStore({
  state: {
    name: '',
    mobilenumber: '',
    password: '',
    wsServerURL: '',
    adminuser: '',
    adminpass: ''
  },
  getters: {
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
    },
    getAdminUser: state => {
      return state.adminuser;
    },
    getAdminPass: state => {
      return state.adminpass;
    }
  },
  mutations: {
    setName(state, payload){
      state.name = payload;
    },
    setMobile(state, payload){
      state.mobilenumber = payload;
    },
    setPass(state, payload){
      state.password = payload;
    },
    setAdminUser(state, payload){
      state.adminuser = payload;
    },
    setAdminPass(state, payload){
      state.adminpass = payload;
    },
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
    },
    setAdminUser(context, payload){
      context.commit('setAdminUser', payload);
    },
    setAdminPass(context, payload){
      context.commit('setAdminPass', payload);
    }
  },
  modules: {
  }
})
