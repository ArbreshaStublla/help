import VideoService from '@/services/videoService';

export const video = {
  namespaced: true,

  state: {
    videos: [],
    loading: false,
  },

  getters: {
    filteredVideos: (state) => (searchQuery) => {
      if (!searchQuery) {
        return state.videos;
      } else {
        const query = searchQuery.toLowerCase();
        return state.videos.filter(video =>
          video.title.toLowerCase().includes(query)
        );
      }
    },
    loading: (state) => state.loading,
  },

  actions: {
    async fetchVideos({ commit }) {
      try {
        commit('SET_LOADING', true);
        const videos = await VideoService.fetchVideos();
        commit('SET_VIDEOS', videos);
      } catch (error) {
        console.error('Error fetching videos:', error.message);
        throw error; // Rethrow the error to handle it in the component
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },

  mutations: {
    SET_VIDEOS(state, videos) {
      state.videos = videos;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
  },
};
