<template>
  <v-container>
    <div class="article-details">
      <div class="header-section" v-if="article.photos && article.photos.length > 0">
        <img :src="getPhotoUrl(article.photos[0].photoUrl)" alt="Header Photo" class="header-photo">
        <div class="overlay">
          <h1>{{ article.title }}</h1>
          <p>{{ article.category }}</p>
        </div>
      </div>

      <div v-for="(content, index) in article.contents" :key="index" :class="{'content-section': true, 'two-columns': index === 1}">
        <div v-if="index > 0 && article.photos[index]" :class="{'article-photo-container': index === 1}">
          <img :src="getPhotoUrl(article.photos[index].photoUrl)" alt="Article Photo" class="article-photo">
        </div>
        <p :class="{'article-content': index === 1}">{{ content.content }}</p>
      </div>

      <v-btn @click="editArticle" color="primary">Edit Article</v-btn>
    </div>
  </v-container>
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
    },
    editArticle() {
      this.$router.push(`/edit/${this.id}`);
    }
  }
};
</script>

<style scoped>
.article-details {
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header-section {
  position: relative;
}

.header-photo {
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: brightness(90%);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.overlay h1 {
  font-size: 36px;
  margin: 0;
}

.overlay p {
  font-size: 18px;
  margin: 10px 0 0;
}

.content-section {
  margin-top: 20px;
}

.article-photo {
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.two-columns {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.article-photo-container {
  flex: 1;
  margin-right: 20px;
}

.article-content {
  flex: 1;
}
</style>
