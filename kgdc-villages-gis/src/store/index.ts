import { createStore } from 'vuex'

export default createStore({
  state: {
    mapObj: {},
    usersModuleWSS: 'ws://localhost:3010',
    gjModuleWSS: 'ws://localhost:3020',
    abadiModuleWSS: 'ws://localhost:3030',
    districtsList: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru (Rural)', 'Bengaluru (Urban)', 'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalburgi', 'Kodagu', 'Kolara', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
    globaltoastmsg: '',
    globaltoastEl: null,
    isLoggedIn: false,
    username: '',
    password: '',
    userDetails: '',
    roles: '',
    karnboundsLoaded: false,
    currentvillage: '',
    currentuniquevillagecode: '',
    lineMeasureEnabled: false,
    areaMeasureEnabled: false,
    featureCounter: 0,
    featuresData: [],
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
    getAbadiModuleWSS(state){
      return state.abadiModuleWSS;
    },
    getDistrictsList(state){
      return state.districtsList;
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
    getUserDetails(state){
      return state.userDetails;
    },
    getFeaturesData(state){
      return state.featuresData
    },
    getKarnBoundsLoaded(state){
      return state.karnboundsLoaded
    },
    getCurrentVillage(state){
      return state.currentvillage
    },
    getCurrentUniqueVillageCode(state){
      return state.currentuniquevillagecode
    },
    getLineMeasureEnabled(state){
      return state.lineMeasureEnabled
    },
    getAreaMeasureEnabled(state){
      return state.areaMeasureEnabled
    },
    getFeatureCounter(state){
      return state.featureCounter
    }
  },
  mutations: {
    setMapObj(state, mapObj){
      state.mapObj = mapObj;
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
    setUserDetails(state, userDetails){
      state.userDetails = userDetails;
    },
    setKarnBoundsLoaded(state, karnboundsLoaded){
      state.karnboundsLoaded = karnboundsLoaded;
    },
    setCurrentVillage(state, currentvillage){
      state.currentvillage = currentvillage;
    },
    setUniqueVillageCode(state, currentuniquevillagecode){
      state.currentuniquevillagecode = currentuniquevillagecode;
    },
    setLineMeasureEnabled(state, enabled){
      state.lineMeasureEnabled = enabled;
    },
    setAreaMeasureEnabled(state, enabled){
      state.areaMeasureEnabled = enabled;
    },
    setFeatureCounter(state, counter){
      state.featureCounter = counter;
    },
    setFeaturesData(state, featuresData){
      state.featuresData = featuresData;
    },
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
    setUserDetails(context, userDetails){
      context.commit('setUserDetails', userDetails);
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
    setLineMeasureEnabled(context, enabled){
      context.commit('setLineMeasureEnabled', enabled);
    },
    setAreaMeasureEnabled(context, enabled){
      context.commit('setAreaMeasureEnabled', enabled);
    },
    setFeatureCounter(context, counter){
      context.commit('setFeatureCounter', counter);
    },
    setFeaturesData(context, featuresData){
      context.commit('setFeaturesData', featuresData);
    },
  },
  modules: {
  }
})