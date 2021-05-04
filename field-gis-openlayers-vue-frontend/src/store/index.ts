import { createStore } from 'vuex'

export default createStore({
  state: {
    showAttributesContainer: true,
    dronenumbersGJ: {},
    loginMsg: 'Press Enter To Continue...',
    loggedIn: false,
    username: '',
    password: '',
    karnboundsGeoJSON: {},
  },
  getters: {
    getAttributesContainerStatus(state){
      return state.showAttributesContainer;
    },
    getDroneNumbersGJ(state){
      return state.dronenumbersGJ;
    },
    getLogInMsg(state){
      return state.loginMsg;
    },
    getLoggedInStatus(state){
      return state.loggedIn;
    },
    getUserName(state){
      return state.username;
    },
    getPassWord(state){
      return state.password;
    },
    getKarnBoundsGJ(state){
      return state.karnboundsGeoJSON;
    },
  },
  mutations: {
    setAttributesContainerStatus(state, showAttributesContainer){
      state.showAttributesContainer = showAttributesContainer;
    },
    setDroneNumbersGJ(state, dronenumbersGJ){
      state.dronenumbersGJ = dronenumbersGJ;
    },
    setLogInMsg(state, loginMsg){
      state.loginMsg = loginMsg;
    },
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
    setUserName(state, username){
      state.username = username;
    },
    setPassWord(state, password){
      state.password = password;
    },
    setKarnBoundsGJ(state, karnboundsgj){
      state.karnboundsGeoJSON = karnboundsgj;
    },
  },
  actions: {
    setAttributesContainerStatus(context, showAttributesContainer){
      context.commit('setAttributesContainerStatus', showAttributesContainer);
    },
    setDroneNumbersGJ(context, dronenumbersGJ){
      context.commit('setDroneNumbersGJ', dronenumbersGJ);
    },
    setLogInMsg(context, loginMsg){
      context.commit('setLogInMsg', loginMsg);
    },
    setLoggedIn(context, loggedIn){
      context.commit('setLoggedIn', loggedIn);
    },
    setUserName(context, username){
      context.commit('setUserName', username);
    },
    setPassWord(context, password){
      context.commit('setPassWord', password);
    },
    setKarnBoundsGJ(context, karnboundsgj){
      context.commit('setKarnBoundsGJ', karnboundsgj);
    },
  },
  modules: {
  }
})
