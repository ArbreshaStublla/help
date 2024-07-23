<template>
  <div class="article-page">
    <v-container>
      <div class="articles-container">
      <div v-if="article" class="article-item">
        <div class="article-header">
          <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-image">
          <div class="article-title-overlay">
            <h3>{{ article.title }}</h3>
          </div>
        </div>
        <div class="content">
          <v-container>
          <div class="article-content">
            <div v-html="article.content"></div>
          </div>
        </v-container>
        </div>
      
      </div>
      <div v-else>
        <p>Duke u ngarkuar...</p>
      </div>
    </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      article: null, 
    };
  },
  mounted() {
    const articleId = this.$route.params.id; 
    this.fetchArticle(articleId);
  },
  methods: {
    fetchArticle(articleId) {
      axios.get(`${process.env.VUE_APP_API_URL}article/${articleId}`)
        .then(response => {
          this.article = response.data;
        })
        .catch(error => {
          console.error('Error fetching article:', error);
        });
    },
    getImageUrl(relativePath) {
      return `http://192.168.44.239:3000${relativePath}`;
    },
  },
};
</script>

<style scoped>
.articles-container {
  margin: auto;
  border-radius: 8px;
}

.article-header {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.article-image {
  width: 100%;
  height: 400px;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(35%);
}

.article-title-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  font-size: 24px;
  color: #fff;
}

.article-content {
  padding: 10px;
  margin-top: 20px;
  border-top: none;
  border-radius: 0 0 5px 5px;
}

.content {
  border: 1px solid #ccc;
  margin-top: 25px;
  height: 100%;
  overflow-y: scroll;
}
</style>
