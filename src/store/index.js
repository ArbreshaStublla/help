// store/index.js

import { createStore } from 'vuex';
import { video } from '../store/video'; 

export default createStore({
  state: {
    searchQuery: ''
  },
  mutations: {
    setSearchQuery(state, query) {
      state.searchQuery = query.toLowerCase();
    }
  },
  actions: {
   
  },
  modules: {
    video, 
  }
});
