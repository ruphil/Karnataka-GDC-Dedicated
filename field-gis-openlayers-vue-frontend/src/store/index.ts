import { createStore } from 'vuex'

export default createStore({
  state: {
    loggedIn: false,
    mapElement: null
  },
  getters: {
    getLoggedInStatus(state){
      return state.loggedIn;
    },
    getMapElement(state){
      return state.mapElement;
    },
  },
  mutations: {
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
    setMapElement(state, mapElement){
      state.mapElement = mapElement;
    },
  },
  actions: {
    setLoggedIn(context, loggedIn){
      context.commit('setLoggedIn', loggedIn);
    },
    setMapElement(context, mapElement){
      context.commit('setMapElement', mapElement);
    },
  },
  modules: {
  }
})
