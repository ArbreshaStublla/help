<template>
  <div class="article-page">
    <div class="articles-container articles-grid">

      <div class="articles-list">
        <div v-for="article in articles" :key="article.articleId" class="article-item">
          <h3>{{ article.title }}</h3>
          <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-image">
     
          <CustomButton :buttonText="'Shfaq më shumë'" class="custom-article-button" @click="navigateToArticleDetails(article.articleId)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CustomButton from '@/components/ButtonComponent.vue'; 

export default {
  name: 'ArticlePage',
  components: {
    CustomButton,
  },
  data() {
    return {
      articles: [], 
    };
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    fetchArticles() {
      axios.get('http://192.168.44.239:3000/article')
        .then(response => {
          this.articles = response.data;
        })
        .catch(error => {
          console.error('Error fetching articles:', error);
         
        });
    },
    getImageUrl(relativePath) {
      return `http://192.168.44.239:3000${relativePath}`;
    },
    navigateToArticleDetails(articleId) {
      this.$router.push({ name: 'articleDetail', params: { id: articleId } });
    },
  },
};
</script>



<style scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.articles-container {
  margin-top: 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjusted min-width for responsiveness */
  gap: 40px;
  align-items: start;
}

.article-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.article-item h3 {
  margin-bottom: 10px;
}

.article-image {
  max-width: 100%;
  height: auto;
}

.custom-article-button {
  margin-top: 10px;
  /* Additional custom styling for the button within articles */
}
</style>
