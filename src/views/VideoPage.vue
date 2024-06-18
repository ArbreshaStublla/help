<template>
  <div>
    <h1>Video List</h1>
    <form @submit.prevent="addVideo">
      <label>Title:</label>
      <input v-model="newVideo.title" required>
      <label>URL:</label>
      <input v-model="newVideo.url" required>
      <label>Description:</label>
      <textarea v-model="newVideo.description" required></textarea>
      <label>Category:</label>
      <input v-model="newVideo.category" required>
      <button type="submit">Add Video</button>
    </form>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="video in videos" :key="video.videoId" class="video-card">
        <h2>{{ video.title }}</h2>
        <img :src="video.thumbnail" alt="Video Thumbnail" />
        <p>{{ video.description }}</p>
        <a :href="video.url" target="_blank">Watch Video</a>
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
    async addVideo() {
      try {
        const response = await axios.post('http://192.168.33.15:3000/videos/add', this.newVideo);
        console.log('Video added:', response.data);
        this.videos.push(response.data);
        this.resetForm();
      } catch (error) {
        console.error('Error adding video:', error);
      }
    },
    resetForm() {
      this.newVideo.title = '';
      this.newVideo.url = '';
      this.newVideo.description = '';
      this.newVideo.category = '';
    }
  }
};
</script>

<style scoped>
.video-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 16px 0;
}
.video-card img {
  max-width: 100%;
  height: auto;
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
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
form button:hover {
  background-color: #0056b3;
}
</style>
