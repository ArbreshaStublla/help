<template>
  <button class="btn create-article-btn" @click="showModal = true">Create Article</button>
  <div class="article-manager">
    <div v-if="articles.length" class="articles-grid">
      <div v-for="article in articles" :key="article.articleId" class="article">
        <div class="article-header">
          <h3>{{ article.title }}</h3>
          <p>Category: {{ article.category }}</p>
        </div>
        <div class="article-content" v-if="!article.showDetails">
          <!-- Show only the first content -->
          <div v-if="article.contents && article.contents.length > 0">
            <p>{{ article.contents[0].content }}</p>
          </div>
          <div class="article-photo" v-if="article.photos && article.photos.length > 0">
            <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Article Photo" class="article-preview-image">
          </div>
        </div>
        <div class="article-details" v-else>
          <!-- Show all contents and photos when details are expanded -->
          <div v-for="(content, index) in article.contents" :key="index" class="article-content">
            <p>{{ content.content }}</p>
          </div>
          <div v-for="(photo, index) in article.photos" :key="index" class="article-photo">
            <img :src="getPhotoUrl(photo.photoUrl)" alt="Article Photo" class="article-full-image">
          </div>
        </div>
        <ButtonComponent v-if="!showDetails" buttonText="Më shumë" @click="toggleDetails(article)" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ButtonComponent from '@/components/ButtonComponent.vue';

export default {
  components: {
    ButtonComponent
  },
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
      article.showDetails = !article.showDetails;
      if (article.showDetails) {
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
  margin-top: 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.article {
  border-radius: 4px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.article h3 {
  margin-top: 0;
}

.article-header {
  margin-bottom: 10px;
}

.article-content {
  margin-bottom: 10px;
}

.article-content p {
  margin: 0;
}

.article-preview {
  display: flex;
  align-items: center;
}

.article-preview-image, .article-full-image {
  width: 80%;
  max-width: 80%;
  height: auto;
  border-radius: 4px;
}

.toggle-details-btn {
  background-color: #17a2b8;
  margin-top: 10px;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.toggle-details-btn:hover {
  background-color: #138496;
}
</style>
