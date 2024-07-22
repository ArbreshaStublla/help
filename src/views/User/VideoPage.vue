<template>
  <div>
    <div v-if="loading">Duke u ngarkuar...</div>
    <div v-else>
      <div v-if="filteredVideos && filteredVideos.length === 0">
        <p>Nuk është gjetur asnjë video.</p>
      </div>
      <div v-else-if="filteredVideos && filteredVideos.length > 0">
        <div v-for="video in paginatedVideos" :key="video.videoId" class="video-card">
          <div class="video-content">
            <div class="video-thumbnail-container">
              <img :src="video.thumbnail" alt="Video Thumbnail" class="video-thumbnail" @click="openVideoModal(video)">
              <div class="play-icon" @click="openVideoModal(video)">
                ▶️
              </div>
            </div>
            <div class="video-description">
              <h3 class="video-title">{{ video.title }}</h3>
              <p>{{ video.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="filteredVideos.length > 0"
      :items="filteredVideos"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChanged="handlePageChange"
    />
    <div v-if="showModal" class="video-modal">
      <div class="video-modal-content">
        <span class="close-icon" @click="closeModal">&times;</span>
        <iframe width="560" height="315" :src="modalVideoUrl" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
  name: 'VideoPage',
  components: {
    PaginationComponent,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      showModal: false,
      modalVideoUrl: '', 
      selectedVideo: null,
    };
  },
  computed: {
    ...mapState({
      videos: state => state.video.videos,
      loading: state => state.video.loading,
      searchQuery: state => state.searchQuery,
    }),
    filteredVideos() {
      if (!this.searchQuery) {
        return this.videos.slice().reverse(); 
      } else {
        const query = this.searchQuery.toLowerCase().trim();
        return this.videos.filter(video =>
          video.title.toLowerCase().includes(query)
        ).slice().reverse(); 
      }
    },
    paginatedVideos() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredVideos.slice(start, end);
    },
  },
  methods: {
    ...mapActions('video', ['fetchVideos']),
    goToVideo(url) {
      window.open(url, '_blank');
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    openVideoModal(video) {
      this.selectedVideo = video;
      this.showModal = true;
      this.modalVideoUrl = this.getVideoEmbedUrl(video.url);
    },
    openInYouTube(url) {
      window.open(url, '_blank');
    },
    closeModal() {
      this.showModal = false;
      this.modalVideoUrl = '';
      this.selectedVideo = null;
    },
    getVideoEmbedUrl(url) {
      // Example function to convert YouTube URL to embed URL
      // Adjust this based on your video URL format and embedding requirements
      // Example conversion for YouTube:
      // https://www.youtube.com/watch?v=VIDEO_ID => https://www.youtube.com/embed/VIDEO_ID
      if (url.includes('youtube.com')) {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        // Handle other video platforms or direct video links here
        return url; // Return as-is if direct link or another platform
      }
    },
  },
  created() {
    this.fetchVideos();
  },
};
</script>

<style scoped>
.video-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 16px 0;
}
.video-content {
  display: flex;
  align-items: flex-start;
}
.video-thumbnail-container {
  position: relative;
}
.video-thumbnail {
  width: 300px;
  height: 200px;
  margin-right: 16px;
  cursor: pointer;
}
.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: white;
  cursor: pointer;
  pointer-events: all;
}
.video-description p {
  padding: 8px;
  margin-top: 50px;
  flex: 1;
}

.video-modal {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.video-modal-content {
  background-color: #fefefe;
  padding: 20px;
  width: 80%;
  max-width: 610px;
  max-height: 80%;
  overflow: hidden;
  position: relative;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>
