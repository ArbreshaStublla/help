

import articleService from '../services/articleService';

const actions = {
  async fetchArticles({ commit }) {
    commit('SET_LOADING', true);
    try {
      const articles = await articleService.getAllArticles();
      commit('SET_ARTICLES', articles);
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async createArticle({ commit }, articleData) {
    try {
      const newArticle = await articleService.createArticle(articleData);
      commit('ADD_ARTICLE', newArticle);
    } catch (error) {
      commit('SET_ERROR', error);
    }
  },
  async updateArticle({ commit }, { articleId, articleData }) {
    try {
      const updatedArticle = await articleService.updateArticle(articleId, articleData);
      commit('UPDATE_ARTICLE', updatedArticle);
    } catch (error) {
      commit('SET_ERROR', error);
    }
  },
  async deleteArticle({ commit }, articleId) {
    try {
      await articleService.deleteArticle(articleId);
      commit('DELETE_ARTICLE', articleId);
    } catch (error) {
      commit('SET_ERROR', error);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
