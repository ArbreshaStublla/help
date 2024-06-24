<template>
    <div>
      <h2>Articles</h2>
      <!-- Display list of articles with their photos -->
      <div class="article-list">
        <div v-for="article in articles" :key="article.articleId" class="article-item">
          <h3>{{ article.title }}</h3>
          <p><strong>Category:</strong> {{ article.category }}</p>
          <p>{{ article.content }}</p>
          <!-- Display photo if photo_path is available -->
          <img v-if="article.photo_path" :src="`http://192.168.33.31:3000/${article.photo_path}`"
               :alt="article.title + ' Photo'" class="article-image">
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
    methods: {
      async fetchArticles() {
        try {
          // Fetch all articles including their photo paths
          const response = await axios.get(`${process.env.VUE_APP_API_URL}article/`);
          this.articles = response.data;
        } catch (error) {
          console.error('Error fetching articles:', error);
          // Handle error, show error message, etc.
        }
      }
    },
    created() {
      // Fetch articles when the component is created
      this.fetchArticles();
    }
  };
  </script>
  
  <style scoped>
  .article-list {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    list-style: none;
    padding: 0;
  }
  
  .article-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }
  
  .article-item h3 {
    margin-top: 0;
  }
  
  .article-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  </style>
  