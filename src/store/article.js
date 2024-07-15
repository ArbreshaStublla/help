
import ArticleService from '../services/articleService';

const state = {
  articles: [],
  loading: false,
  searchQuery: ''  
};

const getters = {
  filteredArticles: state => {
    if (!state.searchQuery.trim()) {
      return state.articles;
    }
    const query = state.searchQuery.toLowerCase().trim();
    return state.articles.filter(article =>
      article.title.toLowerCase().includes(query)
    );
  },
  isLoading: state => state.loading,
  searchQuery: state => state.searchQuery  
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
  },

  async deleteArticle({ commit }, articleId) {
    try {
      await ArticleService.deleteArticle(articleId);
      commit('removeArticle', articleId);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  async addArticle({ commit, dispatch }, formData) {
    try {
      const response = await ArticleService.addArticle(formData);
      console.log('Article added:', response);
      commit('clearArticles'); 
      await dispatch('fetchArticles'); 
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  },

  setSearchQuery({ commit }, query) {
    commit('setSearchQuery', query);
  }
};

const mutations = {
  setArticles: (state, articles) => (state.articles = articles),
  setLoading: (state, loading) => (state.loading = loading),
  removeArticle: (state, articleId) => {
    state.articles = state.articles.filter(article => article.articleId !== articleId);
  },
  clearArticles: state => (state.articles = []),
  setSearchQuery: (state, query) => (state.searchQuery = query) 
};

export default {
  state,
  getters,
  actions,
  mutations
};
