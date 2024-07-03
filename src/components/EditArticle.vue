<template>
    <v-container>
      <div class="edit-article">
        <v-form @submit.prevent="submitForm">
          <v-text-field v-model="article.title" label="Title" required></v-text-field>
          <v-text-field v-model="article.category" label="Category" required></v-text-field>
          
          <div v-for="(content, index) in article.contents" :key="index" class="content-section">
            <v-textarea v-model="content.content" label="Content" required></v-textarea>
          </div>
          
          <div v-for="(photo, index) in article.photos" :key="index" class="photo-section">
            <img :src="getPhotoUrl(photo.photoUrl)" alt="Article Photo" class="article-photo">
            <v-btn @click="removePhoto(index)" color="error">Remove Photo</v-btn>
          </div>
          
          <!-- File input for uploading a new photo -->
          <input type="file" @change="handleFileUpload" accept="image/*">
          
          <v-btn type="submit" color="primary">Save</v-btn>
        </v-form>
      </div>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['id'],
    data() {
      return {
        article: {
          title: '',
          category: '',
          contents: [],
          photos: []
        },
        newPhoto: null // For storing the newly uploaded photo
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
      async submitForm() {
        try {
          // Map contents to format expected by backend
          const updatedContents = this.article.contents.map(content => ({
            contentId: content.contentId,
            articleId: content.articleId,
            content: content.content
          }));
  
          // Prepare payload with updated contents and new photo
          const payload = {
            category: this.article.category,
            title: this.article.title,
            contents: updatedContents,
            photos: this.article.photos
          };
  
          // If a new photo is uploaded, add it to the payload
          if (this.newPhoto) {
            payload.newPhoto = this.newPhoto;
          }
  
          await axios.put(`http://192.168.44.239:3000/article/${this.id}`, payload);
  
          alert('Article updated successfully');
          this.$router.push(`/article/${this.id}`);
        } catch (error) {
          console.error('Error updating article:', error);
          alert('Error updating article');
        }
      },
      removePhoto(index) {
        // Remove photo from the article.photos array
        this.article.photos.splice(index, 1);
      },
      handleFileUpload(event) {
        // Handle file upload for a new photo
        const file = event.target.files[0];
        this.newPhoto = file;
      },
      getPhotoUrl(photoPath) {
        return `http://192.168.44.239:3000/${photoPath}`;
      }
    }
  };
  </script>
  
  <style scoped>
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
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
  }
  </style>
  