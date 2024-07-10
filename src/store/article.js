// src/store/modules/article.js
import ArticleService from '../services/articleService';

const state = {
  articles: [],
  loading: false
};

const getters = {
  allArticles: state => state.articles,
  isLoading: state => state.loading
};

const actions = {
  async fetchArticles({ commit }) {
    commit('setLoading', true);
    try {
      const response = await ArticleService.getArticles();
      commit('setArticles', response);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setArticles: (state, articles) => (state.articles = articles),
  setLoading: (state, loading) => (state.loading = loading)
};

export default {
  state,
  getters,
  actions,
  mutations
};
