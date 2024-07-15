

import { createStore } from 'vuex';
import { video } from '../store/video'; 
import {question} from "../store/question"
import article from "../store/article"

export default createStore({
  state: {
    searchQuery: ''
  },
  mutations: {
    setSearchQuery(state, query) {
      state.searchQuery = query.toLowerCase().trim();
    }
  },
  actions: {
   
  },
  modules: {
    video, 
    question,
    article
  }
});
