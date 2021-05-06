import { createStore } from 'vuex';

export default createStore({
  state: {
    showAttributesContainer: false,
    showSummaryContainer: false,
    dronenumbersGJ: {},
    districtsList: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru (Rural)', 'Bengaluru (Urban)', 'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalburgi', 'Kodagu', 'Kolara', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
    loginMsg: 'Press Enter To Continue...',
    loggedIn: false,
    username: '',
    password: '',
    attributesInfo: {},
    attributesValid: false,
    flightlinekmlValid: false,
    shapefileValid: false,
    uploadStatusMsg: 'GeoServer WFS 2.0',
  },
  getters: {
    getAttributesContainerStatus(state){
      return state.showAttributesContainer;
    },
    getSummaryContainerStatus(state){
      return state.showSummaryContainer;
    },
    getAttributesInfo(state){
      return state.attributesInfo;
    },
    getDroneNumbersGJ(state){
      return state.dronenumbersGJ;
    },
    getDistrictsList(state){
      return state.districtsList;
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
    getAttributesValidity(state){
      return state.attributesValid;
    },
    getflightlinekmlValidity(state){
      return state.flightlinekmlValid;
    },
    getshapefileValidity(state){
      return state.shapefileValid;
    },
    getUploadStatusMsg(state){
      return state.uploadStatusMsg;
    },
  },
  mutations: {
    setAttributesContainerStatus(state, showAttributesContainer){
      state.showAttributesContainer = showAttributesContainer;
    },
    setSummaryContainerStatus(state, showSummaryContainer){
      state.showSummaryContainer = showSummaryContainer;
    },
    setAttributesInfo(state, attributesInfo){
      state.attributesInfo = attributesInfo;
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
    setAttributesValidity(state, attributesValid){
      state.attributesValid = attributesValid;
    },
    setflightlinekmlValidity(state, flightlinekmlValid){
      state.flightlinekmlValid = flightlinekmlValid;
    },
    setshapefileValidity(state, shapefileValid){
      state.shapefileValid = shapefileValid;
    },
    setUploadStatusMsg(state, uploadStatusMsg){
      state.uploadStatusMsg = uploadStatusMsg;
    },
  },
  actions: {
    setAttributesContainerStatus(context, showAttributesContainer){
      context.commit('setAttributesContainerStatus', showAttributesContainer);
    },
    setSummaryContainerStatus(context, showSummaryContainer){
      context.commit('setSummaryContainerStatus', showSummaryContainer);
    },
    setAttributesInfo(context, attributesInfo){
      context.commit('setAttributesInfo', attributesInfo);
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
    setAttributesValidity(context, attributesValid){
      context.commit('setAttributesValidity', attributesValid);
    },
    setflightlinekmlValidity(context, flightlinekmlValid){
      context.commit('setflightlinekmlValidity', flightlinekmlValid);
    },
    setshapefileValidity(context, shapefileValid){
      context.commit('setshapefileValidity', shapefileValid);
    },
    setUploadStatusMsg(context, uploadStatusMsg){
      context.commit('setUploadStatusMsg', uploadStatusMsg);
    },
  },
  modules: {
  }
})
