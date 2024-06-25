<template>
  <div>
    <ButtonComponent v-if="!showForm" buttonText="Shto një post" @click="toggleForm" />
  </div>
  <div class="forma">
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
      <div v-for="(article, index) in articles" :key="article.articleId" class="article-item" :class="{ 'second-in-row': index % 2 !== 0 }">
        <div class="article-image-container">
          <img v-if="article.photo_path" :src="`http://192.168.33.31:3000/${article.photo_path}`"
               :alt="article.title + ' Photo'" class="article-image">
          <img v-else src="placeholder.jpg" alt="Placeholder Image" class="article-image">
        </div>
        <div class="article-content-right">
          <h3>{{ article.title }}</h3>
          <p><strong>Kategoria:</strong> {{ article.category }}</p>
          <p>{{ article.content }}</p>
        </div>
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

        console.log('Artikulli u krijua:', response.data);

        this.fetchArticles();
        
        this.formData.title = '';
        this.formData.content = '';
        this.formData.category = '';
        this.formData.photo = null;

        this.showForm = false;
      } catch (error) {
        console.error('Gabim gjatë krijimit të artikullit:', error);
      }
    },
    async fetchArticles() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}article/`);
        this.articles = response.data;
      } catch (error) {
        console.error('Gabim gjatë marrjes së artikujve:', error);
      }
    },
    confirmDelete(articleId) {
      swal({
        title: 'A jeni të sigurt?',
        text: 'Nuk do të keni mundësi ta riktheni këtë artikull!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            await axios.delete(`${process.env.VUE_APP_API_URL}article/${articleId}`);
        
            this.articles = this.articles.filter(article => article.articleId !== articleId);
            swal('Poof! Artikulli është fshirë me sukses!', {
              icon: 'success',
            });
          } catch (error) {
            console.error('Gabim gjatë fshirjes së artikullit:', error);
            swal('Oops! Diçka shkoi keq gjatë fshirjes së artikullit!', {
              icon: 'error',
            });
          }
        } else {
          swal('Artikulli është i sigurt!');
        }
      });
    },
    toggleForm() {
      this.showForm = !this.showForm; 
    },
    viewMore(article) {
      console.log(`View more clicked for article: ${article.title}`);
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>

<style scoped>
.forma{
  margin-top: 70px;
}

.komponenti {
  margin-top: 325px !important;
}

.article-form {
  margin: auto;
  padding: 20px;
  border-radius: 5px;
}

.komponenti {
  margin-top: 20px; 
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
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(45%, 1fr)); 
  list-style: none;
  padding: 0;
}

.article-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  overflow: hidden; 
  position: relative;
  margin-bottom: 20px; 
}

.article-item.second-in-row {
  margin-left: auto; 
}

.article-image-container {
  flex: 0 0 40%; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: auto; 
}

.article-image {
  max-width: 100%; 
  max-height: 100%;
  object-fit: contain; 
  border-radius: 5px; 
}

.article-content-right {
  flex: 1; 
  padding: 10px;
}

.article-content-right h3 {
  margin-top: 0;
}

.article-content-right p {
  margin: 0 0 10px; 
}
</style>
