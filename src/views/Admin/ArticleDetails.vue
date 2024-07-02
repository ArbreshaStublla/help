<template>
    <div class="article-details">
      <h2>{{ article.title }}</h2>
      <p>Category: {{ article.category }}</p>
      
      <div v-if="article.contents && article.contents.length > 0" class="contents-section">
        <h3>Contents:</h3>
        <div v-for="(content, index) in article.contents" :key="index">
          <p>{{ content.content }}</p>
        </div>
      </div>
  
      <div v-if="article.photos && article.photos.length > 0" class="photos-section">
        <h3>Photos:</h3>
        <div class="photo-container" v-for="(photo, index) in article.photos" :key="index">
          <img :src="getPhotoUrl(photo.photoUrl)" alt="Article Photo" class="article-photo">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['id'],
    data() {
      return {
        article: {}
      };
    },
    async created() {
      await this.fetchArticleDetails();
    },
    methods: {
      async fetchArticleDetails() {
        try {
          const response = await axios.get(`http://192.168.44.239:3000/article/${this.id}`);
          this.article = response.data;
        } catch (error) {
          console.error('Error fetching article details:', error);
        }
      },
      getPhotoUrl(photoPath) {
        return `http://192.168.44.239:3000/${photoPath}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .article-details {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 24px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 10px;
  }
  
  .contents-section {
    margin-top: 20px;
  }
  
  .photos-section {
    margin-top: 20px;
  }
  
  .photo-container {
    margin-bottom: 10px;
  }
  
  .article-photo {
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  