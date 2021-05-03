import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedIn: false,
    mapObj: null,
    mapLayersObj: {}
  },
  getters: {
    getLoggedInStatus(state){
      return state.loggedIn;
    }
  },
  mutations: {
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
    setMapObj(state, mapObj){
      state.mapObj = mapObj;
    },
    setMapLayersObj(state, mapLayer){
      state.mapLayersObj = mapLayer;
    }
  },
  actions: {
    setLoggedIn(context, loggedIn){
      context.commit('setLoggedIn', loggedIn);
    },
    setMapObj(context, mapObj){
      context.commit('setMapObj', mapObj);
    },
    setMapLayersObj(context, mapLayer){
      context.commit('setMapLayersObj', mapLayer);
    }
  },
  modules: {
  }
})
