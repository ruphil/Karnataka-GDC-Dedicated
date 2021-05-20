import { createStore } from 'vuex'

export default createStore({
  state: {
    wsurlBase: 'ws://localhost:3010',
    districtsList: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru (Rural)', 'Bengaluru (Urban)', 'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalburgi', 'Kodagu', 'Kolara', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
    categoryinfo: '',
    globaltoastmsg: '',
    globaltoastEl: null,
    isLoggedIn: false,
    username: '',
    password: '',
    roles: [],
    attributesData: [],
    karnboundsLoaded: false,
  },
  getters: {
    getWSURLBase(state){
      return state.wsurlBase;
    },
    getDistrictsList(state){
      return state.districtsList;
    },
    getCategoryInfo(state){
      return state.categoryinfo;
    },
    getGlobalToastMsg(state){
      return state.globaltoastmsg;
    },
    getGlobalToastEl(state){
      return state.globaltoastEl;
    },
    getLoggedIn(state){
      return state.isLoggedIn;
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
    getAttributesData(state){
      return state.attributesData
    },
    getKarnBoundsLoaded(state){
      return state.karnboundsLoaded
    }
  },
  mutations: {
    setCategoryInfo(state, info){
      state.categoryinfo = info;
    },
    setGlobalToastEl(state, El){
      state.globaltoastEl = El;
    },
    setGlobalToastMsg(state, msg){
      state.globaltoastmsg = msg;
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
    setAttributesData(state, attributesData){
      state.attributesData = attributesData;
    },
    setKarnBoundsLoaded(state, karnboundsLoaded){
      state.karnboundsLoaded = karnboundsLoaded;
    },
  },
  actions: {
    setCategoryInfo(context, info){
      context.commit('setCategoryInfo', info);
    },
    setGlobalToastEl(context, El){
      context.commit('setGlobalToastEl', El);
    },
    setGlobalToastMsg(context, msg){
      context.commit('setGlobalToastMsg', msg);
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
    setAttributesData(context, attributesData){
      context.commit('setAttributesData', attributesData);
    },
    setKarnBoundsLoaded(context, karnboundsLoaded){
      context.commit('setKarnBoundsLoaded', karnboundsLoaded);
    },
  },
  modules: {
  }
})
