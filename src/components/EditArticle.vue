<template>
  <v-container>
    <div class="edit-article">
      <v-form @submit.prevent="submitForm">
        <div class="first">
          <v-text-field v-model="article.title" label="Title" required></v-text-field>
          <v-text-field v-model="article.category" label="Category" required></v-text-field>
          
          <div v-for="(content, index) in article.contents" :key="index" class="content-section">
            <v-textarea v-model="content.content" label="Content" required></v-textarea>
          </div>
          
          <div v-for="(photo, index) in article.photos" :key="index" class="photo-section">
            <img :src="getPhotoUrl(photo.photoUrl)" alt="Article Photo" class="article-photo">
          </div>
        </div>

        <div class="butoni">
          <ButtonComponent :buttonText="'Ruaj ndryshimet'" @clicked="submitForm"></ButtonComponent>
        </div>
        
      </v-form>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert';
import ButtonComponent from './ButtonComponent.vue';

export default {
  components: {
    ButtonComponent
  },
  props: ['id'],
  data() {
    return {
      article: {
        title: '',
        category: '',
        contents: [],
        photos: []
      },
    };
  },
  async created() {
    await this.fetchArticleDetails();
  },
  methods: {
  async fetchArticleDetails() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/article/${this.id}`);
      this.article = response.data;
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  },
  async submitForm() {
    try {
      const updatedContents = this.article.contents.map(content => ({
        contentId: content.contentId,
        articleId: content.articleId,
        content: content.content
      }));

      const payload = {
        category: this.article.category,
        title: this.article.title,
        contents: updatedContents,
        photos: this.article.photos
      };
      await axios.put(`${process.env.VUE_APP_API_URL}/article/${this.id}`, payload);

      swal('Sukses!', 'Posti është ndryshuar me sukses', 'success');

      this.$router.push(`/homeadmin`);
    } catch (error) {
      console.error('Error updating article:', error);
      swal('Error', 'Posti nuk është ndryshuar ', 'error');
    }
  },
  getPhotoUrl(photoPath) {
    return `${process.env.VUE_APP_API_URL}${photoPath}`;
  },
}

};
</script>

<style scoped>
.first {
  position: relative;
}

.butoni {
  position: absolute;
  top: 25px;
}

.edit-article {
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-top: 20px;
}

.photo-section {
  margin-top: 20px;
}

.article-photo {
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
</style>
