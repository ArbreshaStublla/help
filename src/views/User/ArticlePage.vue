<template>
    <div>
      <h1>Articles</h1>
      <ul v-if="articles.length > 0">
        <li v-for="article in articles" :key="article.articleId">
          <h2>{{ article.title }}</h2>
          <p>{{ article.content }}</p>
          <p><strong>Category:</strong> {{ article.category }}</p>
          <div v-if="article.photos && article.photos.length > 0">
            <h3>Photos:</h3>
            <ul class="photo-list">
              <li v-for="photo in article.photos" :key="photo.photoId">
                <img :src="photo.photoUrl" alt="Article Photo">
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <p v-else>No articles found.</p>
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
          const response = await axios.get('http://192.168.33.15:3000/article');
          this.articles = response.data;
        } catch (error) {
          console.error('Error fetching articles:', error);
          // Handle error gracefully, e.g., show a message to the user
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .photo-list {
    list-style-type: none;
    padding: 0;
  }
  .photo-list li {
    display: inline-block;
    margin-right: 10px;
  }
  </style>
  