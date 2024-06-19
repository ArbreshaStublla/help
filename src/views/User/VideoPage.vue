<template>

  <div>
 
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="video in videos" :key="video.videoId" class="video-card">
        <h4 class="video-title">{{ video.title }}</h4>
        <div class="video-content">
          <img :src="video.thumbnail" alt="Video Thumbnail" class="video-thumbnail">
          <div class="video-description">
            <p>{{ video.description }}</p>
            <a :href="video.url" target="_blank">Watch Video</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {

  name: 'VideoPage',
  data() {
    return {
      videos: [],
      loading: true,
      showForm: false,
      newVideo: {
        title: '',
        url: '',
        description: '',
        category: ''
      }
    };
  },
  created() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await axios.get('http://192.168.33.15:3000/videos/');
        this.videos = response.data;
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        this.loading = false;
      }
    },
 
 
  
  }
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
.video-card img {
  max-width: 100%;
  height: auto;
}
.video-content {
  display: flex;
  align-items: flex-start;
}
.video-thumbnail {
  width: 250px; 
  height: 250px; 
  margin-right: 16px;
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
