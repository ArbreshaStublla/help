import VideoService from '../services/videoService';

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
        const videos = await VideoService.fetchVideos();
        commit('SET_VIDEOS', videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addVideo({ commit }, newVideo) {
      try {
        const addedVideo = await VideoService.addVideo(newVideo);
        commit('ADD_VIDEO', addedVideo);
      } catch (error) {
        console.error('Error adding video:', error);
        throw error;
      }
    },

    async updateVideo({ commit, state }, { id, updatedVideo }) {
      try {
        const response = await VideoService.updateVideo(id, updatedVideo);
        commit('UPDATE_VIDEO', response);

        
        const updatedIndex = state.videos.findIndex(v => v.videoId === id);
        if (updatedIndex !== -1) {
          commit('SET_VIDEO', { index: updatedIndex, video: response });
        }
      } catch (error) {
        console.error('Error updating video:', error);
        throw error;
      }
    },

    async deleteVideo({ commit }, videoId) {
      try {
        await VideoService.deleteVideo(videoId);
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
    UPDATE_VIDEO(state, updatedVideo) {
      const index = state.videos.findIndex(video => video.videoId === updatedVideo.videoId);
      if (index !== -1) {
        state.videos.splice(index, 1, updatedVideo);
      }
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_VIDEO(state, { index, video }) {
      if (index !== -1) {
        state.videos.splice(index, 1, video);
      }
    },
  },
};
