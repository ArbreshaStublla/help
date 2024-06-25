<template>
  <div>
    <ButtonComponent v-if="!showForm" buttonText="Shto një post" @click="toggleForm" />
  </div>
  <div>
    <form v-if="showForm" @submit.prevent="submitForm" class="article-form">
      <div class="form-group">
        <label class="form-label">Titulli:</label>
        <input type="text" v-model="formData.title" required class="form-input">
      </div>
      <div class="form-group">
        <label class="form-label">Përmbajtja:</label>
        <textarea v-model="formData.content" required class="form-input"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Kategoria:</label>
        <input type="text" v-model="formData.category" required class="form-input">
      </div>
      <div class="form-group">
        <label class="form-label">Foto:</label>
        <input type="file" @change="handleFileChange" accept="image/*" class="form-input">
      </div>
      <ButtonComponent buttonText="Shto" class="komponenti" @click="handleCustomButtonClick" />
    </form>

    <div class="article-list">
      <div v-for="article in articles" :key="article.articleId" class="article-item">
        <h3>{{ article.title }}</h3>
        <p><strong>Category:</strong> {{ article.category }}</p>
        <p>{{ article.content }}</p>
     
        <img v-if="article.photo_path" :src="`http://192.168.33.31:3000/${article.photo_path}`"
             :alt="article.title + ' Photo'" class="article-image">
        <img v-else src="placeholder.jpg" alt="Placeholder Image" class="article-image">
        
        <button @click="confirmDelete(article.articleId)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import swal from 'sweetalert'; 
import ButtonComponent from '../../components/ButtonComponent.vue';

export default {
  components: {
    ButtonComponent
  },
  data() {
    return {
      formData: {
        title: '',
        content: '',
        category: '',
        photo: null
      },
      articles: [],
      showForm: false
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

        
        this.fetchArticles();
        
       
        this.formData.title = '';
        this.formData.content = '';
        this.formData.category = '';
        this.formData.photo = null;

        
        this.showForm = false;
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
    },
    toggleForm() {
      this.showForm = !this.showForm; 
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
  border-radius: 5px;
}

.komponenti{
  margin-top: 350px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d1d6;
  border-radius: 3px;
  box-sizing: border-box;
}


.form-input[type="file"] {
  border: none; 
}

.article-list {
  display: grid;
  margin-top: 70px;
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
