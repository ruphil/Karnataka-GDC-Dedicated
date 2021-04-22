import { createStore } from 'vuex'

export default createStore({
  state: {
    name: '',
    mobilenumber: '',
    password: '',
    wsServerURL: '',
    dataURL: 'https://raw.githubusercontent.com/daw-kgdc/file-host-permanent/main/vue-attendance-register/app.json',
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
    setWSURL(state, wsurl){
      state.wsServerURL = wsurl;
    },
    setName(state, name){
      state.name = name;
    },
    setMobile(state, mobile){
      state.mobilenumber = mobile;
    },
    setPass(state, pass){
      state.password = pass;
    }
  },
  actions: {
    setWSURL(context, wsurl){
      context.commit('setWSURL', wsurl);
    },
    setName(context, name){
      context.commit('setName', name);
    },
    setMobile(context, mobile){
      context.commit('setMobile', mobile);
    },
    setPass(context, pass){
      context.commit('setPass', pass);
    }
  },
  modules: {
  }
})
