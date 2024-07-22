<template>
  <div class="article-page">
    <div class="articles-container articles-grid">
      <div class="articles-list">
        <div v-for="article in filteredArticles" :key="article.articleId" class="article-item">
          <div class="article-image">
            <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-preview-image">
            <div class="article-details">
              <div class="article-header">
                <h3>{{ article.title }}</h3>
              </div>
              <div class="article-actions">
                <CustomButton :buttonText="'Shfaq më shumë'" class="custom-article-button" @click="navigateToArticleDetails(article.articleId)" />
              </div>
            </div>
          </div>
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
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      articles: [],
    };
  },
  mounted() {
    this.fetchArticles();
  },
  computed: {
    filteredArticles() {
      if (!this.searchQuery) {
        return this.articles;
      }
      const query = this.searchQuery.toLowerCase();
      return this.articles.filter(article => 
        article.title.toLowerCase().includes(query)
      );
    }
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
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.articles-container {
  margin-top: 20px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjusted min-width for responsiveness */
  gap: 90px;
  align-items: start;
}

.article-item {
  margin-bottom: 50px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #eee !important;
}

.article-image {
  position: relative;
  text-align: center;
}

.article-preview-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.article-details {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 180px;
  padding: 30px;
  background-color: #ffffff;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.85;
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}

.article-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.custom-article-button {
  margin-top: 10px;

}
</style>
