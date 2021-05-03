import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedIn: false,
    mapObj: {},
    // mapLayersObj: {}
  },
  getters: {
    getLoggedInStatus(state){
      return state.loggedIn;
    },
    getMapObj(state){
      return state.mapObj;
    }
  },
  mutations: {
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
    setMapObj(state, mapObj){
      state.mapObj = mapObj;
    },
    // addMapLayersObj(state, mapLayerObj){
    //   state.mapLayersObj = {
    //     ...state.mapLayersObj,
    //     mapLayerObj
    //   };
    // }
  },
  actions: {
    setLoggedIn(context, loggedIn){
      context.commit('setLoggedIn', loggedIn);
    },
    setMapObj(context, mapObj){
      context.commit('setMapObj', mapObj);
    },
    // addMapLayersObj(context, mapLayerObj){
    //   context.commit('addMapLayersObj', mapLayerObj);
    // }
  },
  modules: {
  }
})
