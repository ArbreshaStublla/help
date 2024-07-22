<template>
  <div class="article-page">
    <div class="articles-container articles-grid">
      <div class="articles-list">
        <div v-for="article in articles" :key="article.articleId" class="article-item">
          <h3>{{ article.title }}</h3>
          <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-image">
          <CustomButton :buttonText="'Shfaq më shumë'" class="custom-article-button" @click="navigateToArticleDetails(article.articleId)"/>
          <button @click="deleteArticle(article.articleId)" class="delete-button">Fshij</button>
        </div>
      </div>
    </div>

  
    <CustomButton :buttonText="'Shto një postim'" class="custom-add-postim-button" @click="addNewPostim"/>
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
      this.$router.push({ name: 'articleDetails', params: { id: articleId } });
    },
    addNewPostim() {
      this.$router.push('/post');
    },
    deleteArticle(articleId) {
      if (confirm('Are you sure you want to delete this article?')) {
        axios.delete(`http://192.168.44.239:3000/article/${articleId}`)
          .then(() => {
            this.articles = this.articles.filter(article => article.articleId !== articleId);
          })
          .catch(error => {
            console.error('Error deleting article:', error);
          });
      }
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
  position: relative;
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
 
}

.delete-button {
  margin-top: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.delete-button:hover {
  background-color: #ff0000;
}

.custom-add-postim-button {
  margin-top: 20px;
 
}
</style>
