import { createStore } from 'vuex'

export default createStore({
  state: {
    mapObj: {},
    usersModuleWSS: 'ws://localhost:3010',
    gjModuleWSS: 'ws://localhost:3020',
    districtsList: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru (Rural)', 'Bengaluru (Urban)', 'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalburgi', 'Kodagu', 'Kolara', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
    categoryinfo: '',
    globaltoastmsg: '',
    globaltoastEl: null,
    isLoggedIn: false,
    username: '',
    password: '',
    roles: '',
    attributesData: [],
    karnboundsLoaded: false,
    currentvillage: '',
    currentuniquevillagecode: '',
  },
  getters: {
    getMapObj(state){
      return state.mapObj;
    },
    getUsersModuleWSS(state){
      return state.usersModuleWSS;
    },
    getGJModuleWSS(state){
      return state.gjModuleWSS;
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
    },
    getCurrentVillage(state){
      return state.currentvillage
    },
    getCurrentUniqueVillageCode(state){
      return state.currentuniquevillagecode
    }
  },
  mutations: {
    setMapObj(state, mapObj){
      state.mapObj = mapObj;
    },
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
    setCurrentVillage(state, currentvillage){
      state.currentvillage = currentvillage;
    },
    setUniqueVillageCode(state, currentuniquevillagecode){
      state.currentuniquevillagecode = currentuniquevillagecode;
    }
  },
  actions: {
    setMapObj(context, mapObj){
      context.commit('setMapObj', mapObj);
    },
    setSocketClient(context, wsClient){
      context.commit('setSocketClient', wsClient);
    },
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
    setCurrentVillage(context, currentvillage){
      context.commit('setCurrentVillage', currentvillage);
    },
    setUniqueVillageCode(context, currentlgd){
      context.commit('setUniqueVillageCode', currentlgd);
    },
  },
  modules: {
  }
})