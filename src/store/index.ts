import {createStore} from 'vuex'

export default createStore({
  state: {
    activePath: "",
    userInfo:{
      id:"",
      username:""
    },
  },
  getters: {
    getActivePath(state) {
      return state.activePath
    },
    getUserInfo(state) {
      return state.userInfo
    },
  },
  mutations: {
    setActivePath(state,path) {
      state.activePath = path
    },
    setUserInfo(state,user) {
      state.userInfo.id = user.id;
      state.userInfo.username = user.username;
    },
  },
  actions: {},
  modules: {}
})
