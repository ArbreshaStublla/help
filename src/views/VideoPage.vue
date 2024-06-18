<template>
  <div class="butoni">
    <ButtonComponent v-if="!showForm" buttonText="Shto Video" @click="toggleForm" />
  </div>
  <div>
    <div v-if="showForm">
      <form @submit.prevent="addVideo">
        <label>Titulli:</label>
        <input v-model="newVideo.title" class="form-input" required>
        <label>Linku:</label>
        <input v-model="newVideo.url" class="form-input" required>
        <label>Përshkrimi:</label>
        <textarea v-model="newVideo.description" class="form-input" required></textarea>
        <label>Kategoria:</label>
        <input v-model="newVideo.category" class="form-input" required>
        <div class="shto">
          <ButtonComponent buttonText="Shto Video" @click="handleCustomButtonClick" />
        </div>
      </form>
    </div>
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
import ButtonComponent from '../components/ButtonComponent.vue';

export default {
  components: {

    ButtonComponent
    
  },
  name: 'VideoPage',
  data() {
    return {
      videos: [],
      loading: true,
      showForm: false, // Added variable to control form visibility
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
        this.showForm = false; // Hide the form after adding video
      } catch (error) {
        console.error('Error adding video:', error);
      }
    },
    resetForm() {
      this.newVideo.title = '';
      this.newVideo.url = '';
      this.newVideo.description = '';
      this.newVideo.category = '';
    },
    toggleForm() {
      this.showForm = !this.showForm; // Toggle form visibility
    }
  }
};
</script>

<style scoped>
.shto{
  margin-bottom: 70px;
}
.butoni{
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

/* Add Video button style */
button.add-video-button {
  border: 2px solid #1B4D3E; /* Same border as form buttons */
  padding: 10px 20px;
  cursor: pointer;
}

.form-input{
border: 1px solid #d1d1d6;
}

</style>
