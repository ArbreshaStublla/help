<template>
  <div class="butoni">
    <CustomButton buttonText="Postim i ri" @click="showModal = true"></CustomButton>
  </div>
  <div class="article-manager">
    <ModalComponent v-model="showModal">
      <template v-slot:header>
        <v-card-title class="modal-header">
          {{ editMode ? 'Update Article' : 'Create Article' }}
        </v-card-title>
      </template>
      <template v-slot:body>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>
          <div class="form-group">
            <label for="category">Category:</label>
            <input type="text" id="category" v-model="form.category" required>
          </div>
          <div class="form-group">
            <label for="contents">Contents:</label>
            <textarea v-model="form.contentText" rows="3"></textarea>
            <button class="btn add-content-btn" @click.prevent="addContent">Add Content</button>
          </div>
          <ul class="content-list">
            <li v-for="(content, index) in form.contents" :key="index">{{ content }}</li>
          </ul>
          <div class="form-group">
            <label for="photos">Photos:</label>
            <input type="file" id="photos" multiple @change="handleFileUpload">
          </div>
          <button class="btn submit-btn" type="submit">{{ editMode ? 'Update Article' : 'Create Article' }}</button>
        </form>
      </template>
      <template v-slot:footer>
        <v-btn @click="showModal = false" color="primary">Close</v-btn>
      </template>
    </ModalComponent>

    <!-- Article Grid -->
    <div v-if="articles.length" class="articles-grid">
      <div v-for="article in articles" :key="article.articleId" class="article">
        <div class="article-header">
          <h3>{{ article.title }}</h3>
          <p>Category: {{ article.category }}</p>
        </div>
        <div class="article-content">
          <!-- Show only the first content -->
          <div v-if="!article.showDetails">
            <p>{{ article.contents && article.contents.length > 0 ? article.contents[0].content : '' }}</p>
          </div>
          <div class="article-photo" v-if="article.photos && article.photos.length > 0">
            <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Article Photo" class="article-preview-image">
          </div>
        </div>
        <div class="article-actions">
          <button class="btn toggle-details-btn" @click="navigateToArticleDetails(article.articleId)">
            Show Details
          </button>
          <button class="btn edit-btn" @click="editArticle(article)">Edit</button>
          <button class="btn delete-btn" @click="deleteArticle(article.articleId)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ModalComponent from '../../components/ModalComponents.vue'; // Adjust the path as per your actual structure
import CustomButton from '../../components/ButtonComponent.vue'; // Adjust the path as per your actual structure

export default {
  components: {
    ModalComponent,
    CustomButton
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
      this.form.photos = Array.from(event.target.files);
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
.butoni{
margin-right: 20px;
}

.article-manager {
 
  margin: 0 auto;
  padding: 80px 20px 0px 0px;
 
}

h1 {
  text-align: center;
  color: #333;
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
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;

  
}

.article h3 {
  margin-top: 0;
}

.article-header {
  margin-bottom: 10px;
}

.article-content {
  margin-bottom: 10px;
}

.article-content p {
  margin: 0;
}

.article-photo img {
  max-width: 80%;
  height: auto;
  border-radius: 4px;
}

.article-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-btn {
  background-color: #ffc107;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
}

.delete-btn:hover {
  background-color: #c82333;
}

.toggle-details-btn {
  background-color: #17a2b8;
}

.toggle-details-btn:hover {
  background-color: #138496;
}
</style>
