<template>
  <div class="article-manager">
  
    <!-- Display articles -->
    <div v-if="articles.length" class="articles">
    
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
      </div>
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
    toggleDetails(article) {
      if (!article.showDetails) {
        article.showDetails = true;
        this.$router.push({ name: 'articleDetails', params: { id: article.articleId } });
      }
    },
    getPhotoUrl(photoPath) {
      return `http://192.168.44.239:3000/${photoPath}`;
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

.preview-image {
  max-width: 50%; 
  height: auto;
  border-radius: 6px;
}

.toggle-details-btn {
  background-color: #17a2b8;
}

.toggle-details-btn:hover {
  background-color: #138496;
}
</style>
