<template>
  <div>
    <div class="butoni">
      <ButtonComponent v-if="!showForm" buttonText="Shto Video" @click="toggleForm" />
    </div>

    <div>
      <div v-if="showForm">
        <form @submit.prevent="addVideo">
          
        </form>
      </div>
      
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="filteredVideos.length === 0">
          <p>No videos found.</p>
        </div>
        <div v-else>
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
            <button @click="showDeleteConfirmation(video.videoId)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ButtonComponent from '../../components/ButtonComponent.vue';
import Swal from 'sweetalert2'; 

export default {
  components: {
    ButtonComponent
  },
  name: 'VideoPage',
  props: ['searchQuery'], 
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
  computed: {
    filteredVideos() {
      if (!this.searchQuery) {
        return this.videos;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.videos.filter(video =>
          video.title.toLowerCase().includes(query)
        );
      }
    }
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}videos/`);
        this.videos = response.data;
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        this.loading = false;
      }
    },
    async addVideo() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}videos/add`, this.newVideo);
        console.log('Video added:', response.data);
        this.videos.push(response.data);
        this.resetForm();
        this.showForm = false;
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
      this.showForm = !this.showForm;
    },
    goToVideo(url) {
      window.open(url, '_blank');
    },
    async deleteVideo(videoId) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_URL}videos/${videoId}`);
        console.log('Video deleted:', response.data.message);
        
       
        this.videos = this.videos.filter(video => video.videoId !== videoId);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    },
    showDeleteConfirmation(videoId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this video!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteVideo(videoId);
        }
      });
    }
  }
};
</script>

<style scoped>
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
form input,
form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
form button {
  color: #000;
  border: 2px solid #1b4d3e;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
