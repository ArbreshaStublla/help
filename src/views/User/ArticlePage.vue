<template>
  <div class="article-manager">
    <div v-if="articles.length" class="articles-grid">
      <div v-for="article in articles" :key="article.articleId" class="article">
        <div class="article-image">
          <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Article Photo" class="article-preview-image">
          <div class="articleee">
            <div class="article-details">
              <div class="article-header">
                <h3>{{ article.title }}</h3>
              </div>
              <p>Category: {{ article.category }}</p>
              <div class="article-actions">
                <ButtonComponent buttonText="Shfaq më shumë" @click="navigateToArticleDetails(article.articleId)" />
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
import ButtonComponent from '../../components/ButtonComponent.vue'; 

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
    getPhotoUrl(photoPath) {
      return `http://192.168.44.239:3000/${photoPath}`;
    },
    navigateToArticleDetails(articleId) {
      this.$router.push({ name: 'articleDetail', params: { id: articleId } });
    }
  }
};
</script>


<style scoped>
.modal-header{
  margin-left: -10px;
}
.mbyll{
  margin-top: 60px;
}
.kontenti{
  margin-top: 120px;
}
.articleee {
  margin-bottom: 200px;
}

.article-manager {
  margin: 0 auto;
  padding: 80px 20px 0px 20px;
}

.form-groupp {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.form-groupp input:not([type="file"]),
.form-groupp textarea{
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-groupp label {
  margin-bottom: 5px;
}

.form-groupp label {
  margin-bottom: 5px;
}



.butoni {
  margin-top: -75px !important;
  margin-bottom: 70px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input:not([type="file"]),
.form-group textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd; 
}

.add-content-btn {
  background-color: #28a745;
}

.add-content-btn:hover {
  background-color: #218838;
}

.submit-btn {
  align-self: flex-end;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 80px;
  align-items: start; 
}

.article {
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
  bottom: -200px; 
  left: 50%; 
  transform: translateX(-50%);
  width: 70%; 
  height: 250px;
  padding: 10px;
  background-color: #ffffff;
  text-align: center; 
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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

.toggle-details-btn {
  background-color: #17a2b8;
}

.toggle-details-btn:hover {
  background-color: #138496;
}

.delete-btn {
  background-color: transparent; 
  border: none; 
  cursor: pointer;
}

.delete-btn i {
  color: #dc3545; 
}

.delete-btn:hover i {
  color: #c82333; 
}

.photo-previews {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.photo-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>