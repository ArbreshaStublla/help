<template>
  <div class="article-manager">
    <ButtonComponent v-if="!showModal" buttonText="Postim i ri" @click="toggleModal" />
    
    <ModalComponent v-if="showModal" v-model="showModal" @close="closeModal">
      <template #header>
        <span>{{ editMode ? 'Edit Article' : 'Postim i ri' }}</span>
      </template>
      <template #body>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" id="category" v-model="form.category" required>
          </div>
          <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" v-model="form.contentText"></textarea>
        <div class="boton">
          <ButtonComponent buttonText="Shto Permbajtjen" type="button" @click="addContent"/>
        </div>
      </div>
          <div class="form-group">
            <label for="photos">Photos</label>
            <input type="file" id="photos" accept="image/*" multiple @change="handleFileUpload">
            <div v-if="form.photos.length > 0" class="selected-photos">
              <div v-for="(photo, index) in form.photos" :key="index" class="selected-photo">
                <img :src="getPhotoPreview(photo)" alt="Selected Photo" class="preview-image">
              </div>
            </div>
          </div>
          <div class="shto">
            <ButtonComponent :buttonText="editMode ? 'Posto' : 'Posto'" type="submit" />
          </div>
        </form>
      </template>
    </ModalComponent>

    <div v-if="articles.length" class="articles">
      <h2>Articles</h2>
      <div v-for="article in articles" :key="article.articleId" class="article">
        <h3>{{ article.title }}</h3>
        <p>Updated {{ getTimeAgo(article.updatedAt) }}</p>
        <button class="btn toggle-details-btn" @click="toggleDetails(article)">
          {{ article.showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
        <div v-if="article.showDetails" class="article-details">
          <div v-if="article.contents && article.contents.length > 0" class="article-content">
            <ul>
              <li v-for="(content, index) in article.contents" :key="index">{{ content.content }}</li>
            </ul>
          </div>
          <div v-if="article.photos && article.photos.length > 0" class="article-photos">
            <div v-for="(photo, index) in article.photos" :key="index" class="article-photo">
              <img :src="getPhotoUrl(photo.photoUrl)" alt="Article Photo" class="article-preview-image">
            </div>
          </div>
        </div>
        <div class="article-actions">
          <button class="btn edit-btn" @click="editArticle(article)">Edit</button>
          <button class="btn delete-btn" @click="deleteArticle(article.articleId)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '@/components/ButtonComponent.vue';
import ModalComponent from '@/components/ModalComponents.vue';
import axios from 'axios';

export default {
  components: {
    ButtonComponent,
    ModalComponent
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
      showModal: false,
      editMode: false,
      editArticleId: null
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
      this.form.photos = [];
      Array.from(event.target.files).forEach(file => {
        this.form.photos.push(file);
      });
    },
    addContent() {
      if (this.form.contentText) {
        this.form.contents.push({ content: this.form.contentText });
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
        this.showModal = false; // Close modal after submitting the form
        this.fetchArticles();
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
      this.form.contents = article.contents.map(content => ({ content: content.content }));
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
    getPhotoPreview(photo) {
      return URL.createObjectURL(photo);
    },
    toggleDetails(article) {
      article.showDetails = !article.showDetails;
      if (article.showDetails) {
        this.$router.push({ name: 'articleDetails', params: { id: article.articleId } });
      }
    },
    getTimeAgo(updatedAt) {
      const currentTime = new Date();
      const articleTime = new Date(updatedAt);
      const timeDiff = currentTime.getTime() - articleTime.getTime();
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

      if (hoursDiff === 0) {
        return 'just now';
      } else if (hoursDiff === 1) {
        return 'about 1 hour ago';
      } else {
        return `about ${hoursDiff} hours ago`;
      }
    },
    toggleModal() {
      this.editMode = false;
      this.resetForm();
      this.showModal = !this.showModal;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.boton{
  padding-top: 45px;
}
.article-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  text-align: center;
  color: #333;
}
.shto {
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
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  display: inline-block;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.btn:hover {
  background-color: #0056b3;
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

.articles {
  margin-top: 20px;
}

.article {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article h3 {
  margin-top: 0;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.article-content,
.article-photos {
  margin-top: 10px;
}

.article-content ul {
  padding-left: 20px;
}

.article-photo img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.selected-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.selected-photo {
  position: relative;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>

