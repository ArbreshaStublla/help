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
          <div class="button">
            <v-container>
              <ButtonComponent buttonText="Ndrysho postimin" @click="editArticle"></ButtonComponent>
            </v-container>
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
import ButtonComponent from '../../components/ButtonComponent.vue';
import axios from 'axios';

export default {
  components: {
    ButtonComponent
  },
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
  const apiUrl = new URL(process.env.VUE_APP_API_URL);
  const imageUrl = new URL(relativePath, apiUrl);
  console.log(`Image URL: ${imageUrl}`);
  return imageUrl.href;
},

    editArticle() {
      this.$router.push({ name: 'editArticle', params: { id: this.$route.params.id } });
    }
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
  white-space: pre-wrap; 
  overflow: auto;
}

.button {
  padding: 10px 0;
}

.content {
  border: 1px solid #ccc;
  margin-top: 25px;
  height: 100%;
  overflow-y: scroll;
}
</style>
