import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name:""
  },
  mutations: {
    setName(state,name1){
      state.name=name1
    }
  },
  actions: {

  }
})