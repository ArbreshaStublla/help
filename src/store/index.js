// store/index.js

import { createStore } from 'vuex';

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
    // Optional actions
  },
  modules: {
    // Optional modules
  }
});
