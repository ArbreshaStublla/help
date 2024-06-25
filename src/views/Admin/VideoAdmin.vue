<template>
     <div class="butoni">
      <ButtonComponent v-if="!showForm" buttonText="Shto Video" @click="toggleForm" />
    </div>
  <div>
 
    <div>
      <div v-if="showForm">
        <form @submit.prevent="handleAddVideo">
          <label>Titulli:</label>
          <input v-model="newVideo.title" class="form-input" required>
          <label>Linku:</label>
          <input v-model="newVideo.url" class="form-input" required>
          <label>Përshkrimi:</label>
          <textarea v-model="newVideo.description" class="form-input" required></textarea>
          <label>Kategoria:</label>
          <input v-model="newVideo.category" class="form-input" required>
          <div class="shto">
            <ButtonComponent buttonText="Shto Video" type="submit" />
          </div>
        </form>
      </div>
      <div v-if="loading">Duke u ngarkuar...</div>
      <div v-else>
        <div v-if="filteredVideos.length === 0">
          <p>Nuk është gjetur asnjë video.</p>
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
            <button class="delete-button" @click="confirmDelete(video.videoId)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ButtonComponent from '@/components/ButtonComponent.vue';
import swal from 'sweetalert';

export default {
  components: {
    ButtonComponent
  },
  name: 'VideoPage',
  data() {
    return {
      showForm: false,
      newVideo: {
        title: '',
        url: '',
        description: '',
        category: ''
      }
    };
  },
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
    ...mapActions('video', ['fetchVideos', 'addVideo', 'deleteVideo']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async handleAddVideo() {
      try {
        await this.addVideo(this.newVideo);
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
    goToVideo(url) {
      window.open(url, '_blank');
    },
    confirmDelete(videoId) {
      swal({
        title: "A je i sigurt?",
        text: "Pasi të fshihet, nuk do të keni mundësi ta riktheni këtë video!",
        icon: "warning",
        buttons: ['Anulo', 'Po, fshije!'],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.deleteVideo(videoId);
        }
      });
    },
  },
  created() {
    this.fetchVideos();
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

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
  position: relative;
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
.delete-button {
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.delete-button:hover {
  color: #cc0000;
}
</style>
