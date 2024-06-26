// video.js - Vuex store module

import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const video = {
  namespaced: true,

  state: {
    videos: [],
    loading: false,
  },

  getters: {
    filteredVideos: state => searchQuery => {
      if (!searchQuery) {
        return state.videos;
      } else {
        const query = searchQuery.toLowerCase();
        return state.videos.filter(video =>
          video.title.toLowerCase().includes(query)
        );
      }
    },
    loading: state => state.loading,
  },

  actions: {
    async fetchVideos({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}videos/`);
        commit('SET_VIDEOS', response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addVideo({ commit }, newVideo) {
      try {
        const response = await axios.post(`${API_URL}videos/add`, newVideo);
        commit('ADD_VIDEO', response.data); 
      } catch (error) {
        console.error('Error adding video:', error);
        throw error;
      }
    },

    async deleteVideo({ commit }, videoId) {
      try {
        await axios.delete(`${API_URL}videos/${videoId}`);
        commit('DELETE_VIDEO', videoId);
      } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
      }
    },
  },

  mutations: {
    SET_VIDEOS(state, videos) {
      state.videos = videos;
    },
    ADD_VIDEO(state, video) {
      state.videos.push(video);
    },
    DELETE_VIDEO(state, videoId) {
      state.videos = state.videos.filter(video => video.videoId !== videoId);
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
  },
};
