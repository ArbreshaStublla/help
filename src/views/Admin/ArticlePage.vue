<template>
  <div class="article-manager">
    <div class="butoni">
      <CustomButton buttonText="Postim i ri" @click="showModal = true"></CustomButton>
    </div>
    <ModalComponent v-model="showModal">
      <template v-slot:header>
        <v-card-title class="modal-header">
          {{ editMode ? 'Update Article' : 'Krijo Postin' }}
        </v-card-title>
      </template>
      <template v-slot:body>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="title">Titulli:</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>
          <div class="form-group">
            <label for="category">Kategoria:</label>
            <input type="text" id="category" v-model="form.category" required>
          </div>
          <div class="form-group">
            <label for="contents">Përmbajtja:</label>
            <textarea v-model="form.contentText" rows="3"></textarea>
            <CustomButton class="kontenti" buttonText="Shto përmbajtjen" @click.prevent="addContent" />
          </div>
          <ol class="content-list">
            <li v-for="(content, index) in form.contents" :key="index">
              <div v-html="formatContent(content)"></div>
            </li>
          </ol>
          <div class="form-group">
            <input type="file" id="photos" multiple @change="handleFileUpload" required>
            <div class="photo-previews">
              <div v-for="(photo, index) in photoPreviews" :key="index" class="photo-container">
                <img :src="photo" class="photo-preview">
                <button type="button" class="remove-photo-btn" @click="removePhoto(index)">X</button>
              </div>
            </div>
          </div>
          <div class="krijo">
            <CustomButton :buttonText="editMode ? 'Update Article' : 'Krijo Postin'" type="submit" class="artikuull" />
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <v-btn class="mbyll" @click="showModal = false" color="primary">Mbyll</v-btn>
      </template>
    </ModalComponent>

    <div v-if="filteredArticles && filteredArticles.length" class="articles-grid">
      <div v-for="article in paginatedArticles" :key="article.articleId" class="article">
        <div class="article-image" v-if="article.photos && article.photos.length > 0">
          <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Article Photo" class="article-preview-image">
          <div class="articleee">
            <div class="article-details">
              <div class="article-header">
               
                <h3>{{ article.title }}</h3>
              </div>
              <p>Kategoria: {{ article.category }}</p>
              <div class="article-actions">
                <ButtonComponent buttonText="Shfaq më shumë" @click="navigateToArticleDetails(article.articleId)" />
              </div>
            </div>
          </div>
        </div>
        <button class="btn delete-btn" @click="confirmDelete(article.articleId)">
                  <i class="fas fa-trash"></i>
                </button>
      </div>
      
    </div>
    <div v-else>
      <p>Nuk u gjet asnjë postim.</p>
    </div>
    <PaginationComponent
      v-if="filteredArticles.length > 0"
      :items="filteredArticles"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChanged="handlePageChange"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import ModalComponent from '../../components/ModalComponents.vue';
import CustomButton from '../../components/ButtonComponent.vue';
import ButtonComponent from '../../components/ButtonComponent.vue';
import PaginationComponent from '../../components/PaginationComponent.vue';
import swal from 'sweetalert';

export default {
  components: {
    ModalComponent,
    CustomButton,
    ButtonComponent,
    PaginationComponent
  },
  data() {
    return {
      form: {
        title: '',
        category: '',
        contents: [],
        contentText: '',
        photos: []
      },
      photoPreviews: [],
      editMode: false,
      editArticleId: null,
      showModal: false,
      currentPage: 1,
      pageSize: 6,
    };
  },
  computed: {
    ...mapState({
      searchQuery: state => state.article.searchQuery
    }),
    ...mapGetters({
      filteredArticles: 'filteredArticles',
      loading: 'isLoading'
    }),
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredArticles.slice(start, end);
    }
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    ...mapActions({
      fetchArticles: 'fetchArticles',
      deleteArticleAction: 'deleteArticle',
      addArticleAction: 'addArticle',
      setSearchQuery: 'setSearchQuery'
    }),
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.form.photos = this.form.photos.concat(files);
      this.photoPreviews = this.photoPreviews.concat(files.map(file => URL.createObjectURL(file)));
    },
    addContent() {
      if (this.form.contentText.trim()) {
        this.form.contents.push(this.form.contentText.trim());
        this.form.contentText = '';
      }
    },
    formatContent(content) {
      return content.replace(/\n/g, '<br>');
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append('title', this.form.title);
      formData.append('category', this.form.category);
      formData.append('contents', JSON.stringify(this.form.contents));
      this.form.photos.forEach(photo => {
        formData.append('photos', photo);
      });

      try {
        if (this.editMode) {
          await this.updateArticle(formData);
        } else {
          await this.addArticleAction(formData);
        }
        this.resetForm();
        this.fetchArticles();
        this.showModal = false;
      } catch (error) {
        console.error('Error submitting article:', error);
      }
    },
    async updateArticle(formData) {
      try {
        await this.$store.dispatch('updateArticle', {
          articleId: this.editArticleId,
          formData: formData
        });
      } catch (error) {
        console.error('Error updating article:', error);
        throw error;
      }
    },
    confirmDelete(articleId) {
      swal({
        title: 'A jeni i sigurt?',
        text: 'Kjo veprim do të fshijë përgjithmonë artikullin!',
        icon: 'warning',
        buttons: ['Anulo', 'Fshij'],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            await this.deleteArticleAction(articleId);
            swal({
              title: 'Fshirë!',
              text: 'Artikulli është fshirë me sukses.',
              icon: 'success',
              timer: 3000,
              buttons: false,
            });
          } catch (error) {
            console.error('Error deleting article:', error);
          } finally {
            this.fetchArticles();
          }
        }
      });
    },
    editArticle(article) {
      this.editMode = true;
      this.editArticleId = article.articleId;
      this.form.title = article.title;
      this.form.category = article.category;
      this.form.contents = article.contents.map(content => content.content);
      this.showModal = true;
    },
    getPhotoUrl(photoPath) {
      return `${process.env.VUE_APP_API_URL}${photoPath}`;
    },
    navigateToArticleDetails(articleId) {
      this.$router.push({ name: 'articleDetails', params: { id: articleId } });
    },
    updateSearchQuery(event) {
      this.setSearchQuery(event.target.value);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    resetForm() {
      this.form = {
        title: '',
        category: '',
        contents: [],
        contentText: '',
        photos: []
      };
      this.photoPreviews = [];
      this.editMode = false;
      this.editArticleId = null;
    },
    removePhoto(index) {
      this.form.photos.splice(index, 1);
      this.photoPreviews.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.modal-header {
  margin-left: -10px;
}
.mbyll {
  margin-top: 60px;
}
.kontenti {
  margin-top: 120px;
}
.articleee {
  margin-bottom: 200px;
}

.article-manager {
  margin: 0 auto;
  padding: 80px 20px 0px 20px;
}

.form-groupp {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.form-groupp input:not([type="file"]),
.form-groupp textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-groupp label {
  margin-bottom: 5px;
}

.form-groupp label {
  margin-bottom: 5px;
}

.butoni {
  margin-top: -75px !important;
  margin-bottom: 80px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input:not([type="file"]),
.form-group textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.add-content-btn {
  background-color: #28a745;
}

.add-content-btn:hover {
  background-color: #218838;
}

.submit-btn {
  align-self: flex-end;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 40px;
  align-items: start;
}

.article {
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #eee !important;
}

.article-image {
  position: relative;
  text-align: center;
}

.article-preview-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.article-details {
  position: absolute;
  bottom: -180px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 300px;
  padding: 10px;
  background-color: #ffffff;
  text-align: center;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.85;
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  text-align: center;
}
.article-header p{

opacity: 1;
}

.article-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
  opacity:1;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.toggle-details-btn {
  background-color: #17a2b8;
}

.toggle-details-btn:hover {
  background-color: #138496;
}

.delete-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.delete-btn i {
  color: #dc3545;
  padding-left: 15px;
}

.delete-btn:hover i {
  color: #c82333;
}

.photo-previews {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.photo-container {
  position: relative;
}

.photo-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-photo-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
