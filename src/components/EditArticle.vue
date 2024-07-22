<template>
  <div class="edit-article-page">
    <v-container>
      <div class="form-container">
        <h2>Ndrysho Postimin</h2>
        <form @submit.prevent="updateArticle">
          <v-text-field
            v-model="article.title"
            label="Title"
            required
          ></v-text-field>

          <v-textarea
            v-model="article.content"
            label="Content"
            required
          ></v-textarea>

          <v-file-input
            v-model="file"
            label="Upload Image"
            accept="image/*"
          ></v-file-input>

          <v-btn type="submit" color="primary">Update Article</v-btn>
          <v-btn @click="cancelEdit" color="secondary">Cancel</v-btn>
        </form>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const article = ref({
      title: '',
      content: '',
      imageUrl: '',
    });
    const file = ref(null);

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://192.168.44.239:3000/article/${route.params.id}`);
        article.value = response.data;
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    const updateArticle = async () => {
      const formData = new FormData();
      formData.append('title', article.value.title);
      formData.append('content', article.value.content);
      if (file.value) {
        formData.append('image', file.value);
      }

      try {
        await axios.put(`http://192.168.44.239:3000/article/${route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        router.push({ name: 'articlePage', params: { id: route.params.id } });
      } catch (error) {
        console.error('Error updating article:', error);
      }
    };

    const cancelEdit = () => {
      router.push({ name: 'articlePage', params: { id: route.params.id } });
    };

    fetchArticle();

    return {
      article,
      file,
      updateArticle,
      cancelEdit,
    };
  },
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.v-text-field,
.v-textarea,
.v-file-input {
  margin-bottom: 20px;
}

.v-btn {
  margin-right: 10px;
}
</style>
