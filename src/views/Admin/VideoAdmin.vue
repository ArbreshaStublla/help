<template>
  <div class="butoni">
    <ButtonComponent v-if="!showForm" buttonText="Shto Video" @click="toggleModal" />
  </div>
  <div>
    <div>
      <div>
        <div v-if="showForm">
          <form @submit.prevent="handleAddOrUpdateVideo">
            <label>Titulli:</label>
            <input v-model="form.title" class="form-input" required>
            <label>Linku:</label>
            <input v-model="form.url" class="form-input" required>
            <label>Përshkrimi:</label>
            <textarea v-model="form.description" class="form-input" required></textarea>
            <div class="shto">
              <ButtonComponent :buttonText="editMode ? 'Ruaj Ndryshimet' : 'Shto Video'" type="submit" />
            </div>
          </form>
        </div>
        <div v-if="loading">Duke u ngarkuar...</div>
        <div v-else>
          <div v-if="filteredVideos.length === 0">
            <p>Nuk është gjetur asnjë video.</p>
          </div>
          <div v-else>
            <div v-for="video in paginatedVideos" :key="video.videoId" class="video-card">
              
              <div class="video-content">
                <div class="video-thumbnail-container">
                  <img :src="video.thumbnail" alt="Video Thumbnail" class="video-thumbnail">
                  <div class="play-icon" @click="goToVideo(video.url)">
                    ▶️
                  </div>
                </div>
                <div class="video-description">
                  <h3 class="video-title">{{ video.title }}</h3>
                  <p>{{ video.description }}</p>
                </div>
              </div>
              <button class="edit-button" @click="openEditForm(video)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-button" @click="confirmDelete(video.videoId)">
                <i class="fas fa-trash"></i>
              </button>
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
      <ModalComponent v-if="showModal" v-model="showModal" @close="closeModal">
        <template #header>
          <span>{{ editMode ? 'Të dhënat për këtë video' : 'Shto Video' }}</span>
        </template>
        <template #body>
          <form @submit.prevent="handleAddOrUpdateVideo">
            <label>Titulli:</label>
            <input v-model="form.title" class="form-input" required>
            <label>Linku:</label>
            <input v-model="form.url" class="form-input" required>
            <label>Përshkrimi:</label>
            <textarea v-model="form.description" class="form-input" required></textarea>
            <div class="shto">
              <ButtonComponent :buttonText="editMode ? 'Ruaj Ndryshimet' : 'Shto Video'" type="submit" />
            </div>
          </form>
        </template>
      </ModalComponent>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ButtonComponent from '@/components/ButtonComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import ModalComponent from '@/components/ModalComponents.vue';
import swal from 'sweetalert';

export default {
  components: {
    ButtonComponent,
    PaginationComponent,
    ModalComponent,
  },
  name: 'VideoPage',
  data() {
    return {
      showForm: false,
      showModal: false,
      editMode: false,
      form: {
        id: null,
        title: '',
        url: '',
        description: '',
      },
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    ...mapState({
      videos: (state) => state.video.videos,
      loading: (state) => state.video.loading,
      searchQuery: (state) => state.searchQuery,
    }),
    filteredVideos() {
      if (!this.searchQuery) {
        return this.videos;
      } else {
        const query = this.searchQuery.toLowerCase().trim();
        return this.videos.filter((video) =>
          video.title.toLowerCase().includes(query)
        );
      }
    },
    paginatedVideos() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredVideos.slice(start, end);
    },
  },
  methods: {
    ...mapActions('video', ['fetchVideos', 'addVideo', 'deleteVideo', 'updateVideo']),
    toggleModal() {
      this.editMode = false;
      this.resetForm();
      this.showModal = !this.showModal;
    },
    openEditForm(video) {
      this.editMode = true;
      this.form.id = video.videoId;
      this.form.title = video.title || '';
      this.form.url = video.url || '';
      this.form.description = video.description || '';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    async handleAddOrUpdateVideo() {
  try {
    if (this.editMode) {
      if (!this.form.id) {
        console.error('Video ID is undefined or invalid');
        return;
      }
      if (!this.isValidForm(this.form)) {
        console.error('Form data is incomplete or invalid');
        return;
      }
      await this.updateVideo({ id: this.form.id, updatedVideo: this.form });
      swal({
        title: 'Sukses!',
        text: 'Ndryshimi është kryer me sukses.',
        icon: 'success',
        timer: 3000,
        buttons: false,
      });
    } else {
      if (!this.isValidForm(this.form)) {
        console.error('Form data is incomplete or invalid');
        return;
      }
      await this.addVideo(this.form);
      swal({
        title: 'Sukses!',
        text: 'Video u shtua me sukses!',
        icon: 'success',
        timer: 3000,
        buttons: false,
      });
    }
    this.resetForm();
    this.showModal = false;
  } catch (error) {
    console.error('Error adding/updating video:', error);
  }
},
    resetForm() {
      this.form.id = null;
      this.form.title = '';
      this.form.url = '';
      this.form.description = '';
    },
    isValidForm(form) {
      return !!form.title && !!form.url && !!form.description;
    },
    goToVideo(url) {
      window.open(url, '_blank');
    },
    async confirmDelete(videoId) {
      const willDelete = await swal({
        title: 'A je i sigurt?',
        text: 'Pasi të fshihet, nuk do të keni mundësi ta riktheni këtë video!',
        icon: 'warning',
        buttons: ['Anulo', 'Po, fshije!'],
        dangerMode: true,
      });

      if (willDelete) {
        await this.deleteVideo(videoId);
        swal({
          title: 'Sukses!',
          text: 'Video është fshirë me sukses!',
          icon: 'success',
          timer: 3000,
          buttons: false,
        });
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
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
.edit-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 50px;
}
.edit-button {
  color: #0056b3;
}
.delete-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.delete-button {
  color: #cc0000;
}
</style>
