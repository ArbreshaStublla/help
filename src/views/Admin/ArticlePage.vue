<template>
  <div class="article-manager">
   
  
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
        <button class="btn add-content-btn" type="button" @click="addContent">Add Content</button>
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
      <button class="btn submit-btn" type="submit">{{ editMode ? 'Update Article' : 'Add Article' }}</button>
    </form>

    <hr>

  
    <div v-if="articles.length" class="articles">
      <h2>Articles</h2>
      <div v-for="article in articles" :key="article.articleId" class="article">
        <h3>{{ article.title }}</h3>
        <p>Category: {{ article.category }}</p>
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
import axios from 'axios';

export default {
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
      // Reset form.photos array to clear previous selections
      this.form.photos = [];
      // Capture selected files and display them
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
      // Create a URL object from the File or Blob object to display preview
      return URL.createObjectURL(photo);
    },
    toggleDetails(article) {
      article.showDetails = !article.showDetails;
      if (article.showDetails) {
        this.$router.push({ name: 'articleDetails', params: { id: article.articleId } });
      }
    }
  }
};
</script>

<style scoped>
.article-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1, h2 {
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
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.article h3 {
  margin-top: 0;
}

.article-content,
.article-photo {
  margin: 10px 0;
}

.article-content p {
  margin: 0;
}

.article-photo img {
  max-width: 100%;
  border-radius: 4px;
}

.selected-photo {
  margin-top: 10px;
}

.preview-image {
  max-width: 50%; 
  height: auto;
  border-radius: 6px;
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
