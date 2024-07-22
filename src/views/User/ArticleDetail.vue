<template>
  <div class="article-page">
    <div class="articles-container">
      <div v-if="article" class="article-item">
        <div class="article-header">
          <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-image">
          <div class="article-title-overlay">
            <h3>{{ article.title }}</h3>
          </div>
        </div>
        <v-container>
          <div class="article-content">
            <div v-html="article.content"></div>
          </div>
        </v-container>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      article: null, // Store the fetched article
    };
  },
  mounted() {
    // Fetch article based on route parameter
    const articleId = this.$route.params.id; // Fetches ID from route parameter
    this.fetchArticle(articleId);
  },
  methods: {
    fetchArticle(articleId) {
      axios.get(`http://192.168.44.239:3000/article/${articleId}`)
        .then(response => {
          this.article = response.data;
        })
        .catch(error => {
          console.error('Error fetching article:', error);
          // Handle error - show error message to user
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
  margin:  auto;
 
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
  filter: brightness(50%);
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

}



.article-content {
  padding: 10px;
  margin-top: 20px; /* Increased margin for content below header */

  border-top: none; /* Remove top border to separate from header */
  border-radius: 0 0 5px 5px; /* Rounded corners at bottom */
}
</style>
