<template>
  <div>
    <div v-if="loading">Duke u ngarkuar...</div>
    <div v-else>
      <div v-if="filteredVideos && filteredVideos.length === 0">
        <p>Nuk është gjetur asnjë video.</p>
      </div>
      <div v-else-if="filteredVideos && filteredVideos.length > 0">
        <div v-for="video in filteredVideos" :key="video.videoId" class="video-card">
          <h4 class="video-title">{{ video.title }}</h4>
          <div class="video-content">
            <div class="video-thumbnail-container">
              <img :src="video.thumbnail" alt="Video Thumbnail" class="video-thumbnail">
              <div class="play-icon" @click="goToVideo(video.url)">
                ▶️
              </div>
            </div>
            <div class="video-description">
              <p>{{ video.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'VideoPage',
  computed: {
    ...mapState({
      videos: state => state.video.videos,
      loading: state => state.video.loading
    }),
    filteredVideos() {
      if (!this.searchQuery) {
        return this.videos;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.videos.filter(video =>
          video.title.toLowerCase().includes(query)
        );
      }
    },
  },
  methods: {
    ...mapActions('video', ['fetchVideos']),
    goToVideo(url) {
      window.open(url, '_blank');
    },
  },
  created() {
    this.fetchVideos();
  },
};
</script>


<style scoped>
.shto {
  margin-bottom: 70px;
}
.butoni {
  margin-bottom: 70px;
}
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
}
.video-title {
  padding-bottom: 10px;
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
.form-input {
  border: 1px solid #d1d1d6;
}
form {
  margin-bottom: 20px;
}
form label {
  display: block;
  margin-bottom: 5px;
}
form input, form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
form button {
  color: #000;
  border: 2px solid #1B4D3E;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
