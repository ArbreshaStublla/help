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
          <ul class="content-list">
            <li v-for="(content, index) in form.contents" :key="index">{{ content }}</li>
          </ul>
          <div class="form-group">
            <label for="photos">Fotot:</label>
            <input type="file" id="photos" multiple @change="handleFileUpload">
            <div class="photo-previews">
              <img v-for="(photo, index) in photoPreviews" :key="index" :src="photo" class="photo-preview">
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

    <div v-if="articles.length" class="articles-grid">
      <div v-for="article in articles" :key="article.articleId" class="article">
        <div class="article-image">
          <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Article Photo" class="article-preview-image">
          <div class="articleee">
            <div class="article-details">
              <div class="article-header">
                <button class="btn delete-btn" @click="confirmDelete(article.articleId)">
                  <i class="fas fa-trash"></i>
                </button>
                <h3>{{ article.title }}</h3>
              </div>
              <p>Kategoria: {{ article.category }}</p>
              <div class="article-actions">
                <ButtonComponent buttonText="Shfaq më shumë" @click="navigateToArticleDetails(article.articleId)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert';
import ModalComponent from '../../components/ModalComponents.vue';
import CustomButton from '../../components/ButtonComponent.vue';
import ButtonComponent from '../../components/ButtonComponent.vue';

export default {
  components: {
    ModalComponent,
    CustomButton,
    ButtonComponent
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
      articles: [],
      editMode: false,
      editArticleId: null,
      showModal: false
    };
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await axios.get('http://192.168.44.239:3000/article');
        this.articles = response.data;
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.form.photos = files;
      this.photoPreviews = files.map(file => URL.createObjectURL(file));
    },
    addContent() {
      if (this.form.contentText) {
        this.form.contents.push(this.form.contentText);
        this.form.contentText = '';
      }
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
          await axios.put(`http://192.168.44.239:3000/article/${this.editArticleId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          await axios.post('http://192.168.44.239:3000/article', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        this.resetForm();
        this.fetchArticles();
        this.showModal = false;
      } catch (error) {
        console.error('Error submitting article:', error);
      }
    },
    async confirmDelete(articleId) {
      swal({
        title: 'A jeni i sigurt?',
        text: 'Kjo veprim do të fshijë përgjithmonë artikullin!',
        icon: 'warning',
        buttons: ['Anulo', 'Fshij'],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await this.deleteArticle(articleId);
          this.fetchArticles();
          swal({
            title: 'Fshirë!',
            text: 'Artikulli është fshirë.',
            icon: 'success',
            timer: 3000,
            buttons: false,
          });
        }
      });
    },
    async deleteArticle(articleId) {
      try {
        await axios.delete(`http://192.168.44.239:3000/article/${articleId}`);
        this.fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    },
    editArticle(article) {
      this.editMode = true;
      this.editArticleId = article.articleId;
      this.form.title = article.title;
      this.form.category = article.category;
      this.form.contents = article.contents.map(content => content.content);
      this.showModal = true;
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
    getPhotoUrl(photoPath) {
      return `http://192.168.44.239:3000/${photoPath}`;
    },
    navigateToArticleDetails(articleId) {
      this.$router.push({ name: 'articleDetails', params: { id: articleId } });
    }
  }
};
</script>

<style scoped>
.modal-header{
  margin-left: -10px;
}
.mbyll{
  margin-top: 60px;
}
.kontenti{
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
.form-groupp textarea{
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
  margin-bottom: 70px;
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
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 120px;
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
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 250px;
  padding: 10px;
  background-color: #ffffff;
  text-align: center;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
 
.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  text-align: center;
}
 
.article-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
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
}
 
.delete-btn:hover i {
  color: #c82333;
}
 
.photo-previews {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
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
</style>
 