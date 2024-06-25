<template>
  <div>
    <h2>Create Article</h2>
   
    <form @submit.prevent="submitForm" class="article-form">
      <div class="form-group">
        <label>Title:</label>
        <input type="text" v-model="formData.title" required>
      </div>
      <div class="form-group">
        <label>Content:</label>
        <textarea v-model="formData.content" required></textarea>
      </div>
      <div class="form-group">
        <label>Category:</label>
        <input type="text" v-model="formData.category" required>
      </div>
      <div class="form-group">
        <label>Photo:</label>
        <input type="file" @change="handleFileChange" accept="image/*">
      </div>
      <button type="submit">Submit</button>
    </form>
 
    <hr>
 
    <h2>Articles</h2>
   
    <div class="article-list">
      <div v-for="article in articles" :key="article.articleId" class="article-item">
        <h3>{{ article.title }}</h3>
        <p><strong>Category:</strong> {{ article.category }}</p>
        <p>{{ article.content }}</p>
     
        <img v-if="article.photo_path" :src="`http://192.168.33.31:3000/${article.photo_path}`"
             :alt="article.title + ' Photo'" class="article-image">
        <img v-else src="placeholder.jpg" alt="Placeholder Image" class="article-image"> <!-- Example placeholder image -->
        
        <!-- Delete button with SweetAlert confirmation -->
        <button @click="confirmDelete(article.articleId)">Delete</button>
      </div>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios';
import swal from 'sweetalert';

export default {
  data() {
    return {
      formData: {
        title: '',
        content: '',
        category: '',
        photo: null
      },
      articles: []
    };
  },
  methods: {
    handleFileChange(event) {
      this.formData.photo = event.target.files[0];
    },
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append('title', this.formData.title);
        formData.append('content', this.formData.content);
        formData.append('category', this.formData.category);
        formData.append('photo', this.formData.photo);

        const response = await axios.post(`${process.env.VUE_APP_API_URL}article/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Article created:', response.data);

        // Update articles list after creating a new article
        this.fetchArticles();
        
        // Clear form data after submission
        this.formData.title = '';
        this.formData.content = '';
        this.formData.category = '';
        this.formData.photo = null;
      } catch (error) {
        console.error('Error creating article:', error);
      }
    },
    async fetchArticles() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}article/`);
        this.articles = response.data;
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    confirmDelete(articleId) {
      // Using sweetalert for confirmation
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this article!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            await axios.delete(`${process.env.VUE_APP_API_URL}article/${articleId}`);
            // Update local articles array after deletion
            this.articles = this.articles.filter(article => article.articleId !== articleId);
            swal('Poof! Your article has been deleted!', {
              icon: 'success',
            });
          } catch (error) {
            console.error('Error deleting article:', error);
            swal('Oops! Something went wrong while deleting the article!', {
              icon: 'error',
            });
          }
        } else {
          swal('Your article is safe!');
        }
      });
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>
 
<style scoped>
.article-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
 
.form-group {
  margin-bottom: 15px;
}
 
.form-group label {
  font-weight: bold;
}
 
.article-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  list-style: none;
  padding: 0;
}
 
.article-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
 
.article-item h3 {
  margin-top: 0;
}
 
.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
