<template>
  <div>
    <h2>All Articles</h2>
    <div v-for="article in articles" :key="article.articleId" class="article-card">
      <h3>{{ article.title }}</h3>
      <p>Category: {{ article.category }}</p>
      <ul>
        <li v-for="photo in article.photos" :key="photo.photoId">
          <img :src="getPhotoUrl(photo)" alt="Article Photo" class="article-photo" />
        </li>
      </ul>
      <div v-html="article.content"></div>
      <button @click="deleteArticle(article.articleId)">Delete Article</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      articles: []
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await axios.get('http://localhost:3000/article');
        this.articles = response.data;
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    async deleteArticle(articleId) {
      try {
        await axios.delete(`http://localhost:3000/article/${articleId}`);
        this.articles = this.articles.filter(article => article.articleId !== articleId);
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    },
    getPhotoUrl(photo) {
      return `http://localhost:3000/${photo.photoUrl}`;
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>

<style scoped>
.article-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.article-card h3 {
  margin-bottom: 5px;
}

.article-card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  max-height: 200px; /* Adjust the maximum height as needed */
}

.article-card button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #dc3545; /* Red color for delete button */
  color: white;
  border: none;
  cursor: pointer;
}

.article-card button:hover {
  background-color: #c82333; /* Darker shade on hover */
}
</style>
