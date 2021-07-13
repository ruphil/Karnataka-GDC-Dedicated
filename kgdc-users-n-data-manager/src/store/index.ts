import { createStore } from 'vuex'

export default createStore({
  state: {
    usersNDataModuleWSS: 'ws://localhost:3010',
    globaltoastmsg: '',
    globaltoastEl: null,
    jurisdictions: [],
    isLoggedIn: false,
    username: '',
    password: '',
    roles: '',
    usersTable: [],
    dronenumbers: []
  },
  getters: {
    getUsersNDataModuleWSS(state){
      return state.usersNDataModuleWSS;
    },
    getGlobalToastMsg(state){
      return state.globaltoastmsg;
    },
    getGlobalToastEl(state){
      return state.globaltoastEl;
    },
    getLoggedIn(state) {
      return state.isLoggedIn;
    },
    getJurisdictions(state) {
      return state.jurisdictions;
    },
    getUsername(state){
      return state.username;
    },
    getPassword(state){
      return state.password;
    },
    getUserRoles(state){
      return state.roles;
    },
    getUsersTable(state){
      return state.usersTable;
    },
    getDroneNumbers(state){
      return state.dronenumbers;
    },
  },
  mutations: {
    setGlobalToastEl(state, El){
      state.globaltoastEl = El;
    },
    setGlobalToastMsg(state, msg){
      state.globaltoastmsg = msg;
    },
    setJurisdictions(state, jurisdictions){
      state.jurisdictions = jurisdictions;
    },
    setLoggedIn(state, isLoggedIn){
      state.isLoggedIn = isLoggedIn;
    },
    setGlobalUsename(state, username){
      state.username = username;
    },
    setGlobalPassword(state, password){
      state.password = password;
    },
    setUserRoles(state, roles){
      state.roles = roles;
    },
    setUsersTable(state, usersTable){
      state.usersTable = usersTable;
    },
    setDroneNumbers(state, dronenumbers){
      state.dronenumbers = dronenumbers;
    },
  },
  actions: {
    setGlobalToastEl(context, El){
      context.commit('setGlobalToastEl', El);
    },
    setGlobalToastMsg(context, msg){
      context.commit('setGlobalToastMsg', msg);
    },
    setJurisdictions(context, jurisdictions){
      context.commit('setJurisdictions', jurisdictions);
    },
    setLoggedIn(context, isLoggedIn){
      context.commit('setLoggedIn', isLoggedIn);
    },
    setGlobalUsename(context, username){
      context.commit('setGlobalUsename', username);
    },
    setGlobalPassword(context, password){
      context.commit('setGlobalPassword', password);
    },
    setUserRoles(context, roles){
      context.commit('setUserRoles', roles);
    },
    setUsersTable(context, usersTable){
      context.commit('setUsersTable', usersTable);
    },
    setDroneNumbers(context, dronenumbers){
      context.commit('setDroneNumbers', dronenumbers);
    },
  }
});
