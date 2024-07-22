<template>
  <div class="article-page">
    <div class="articles-container articles-grid">
      <div class="articles-list">
        <div v-if="filteredArticles.length === 0">
          <p>Nuk është gjetur asnjë postim.</p>
        </div>
        <div v-for="article in paginatedArticles" :key="article.articleId" class="article-item">
          <div class="article-image">
            <img v-if="article.imageUrl" :src="getImageUrl(article.imageUrl)" alt="Article Image" class="article-preview-image">
            <div class="article-details">
              <div class="article-header">
                <h3>{{ article.title }}</h3>
                <button class="delete-button" @click="confirmDelete(article.articleId)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div class="article-actions">
                <CustomButton :buttonText="'Shfaq më shumë'" class="custom-article-button" @click="navigateToArticleDetails(article.articleId)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page"> <PaginationComponent
      v-if="filteredArticles.length > pageSize"
      :items="filteredArticles"
      :pageSize="pageSize"
      :currentPage="currentPage"
      :class="page"
      @pageChanged="handlePageChange"
    /></div>
    <CustomButton :buttonText="'Shto një postim'" class="custom-add-postim-button" @click="addNewPostim"/>
  </div>
</template>

<script>
import axios from 'axios';
import CustomButton from '@/components/ButtonComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import swal from 'sweetalert';

export default {
  name: 'ArticlePage',
  components: {
    CustomButton,
    PaginationComponent,
  },
  props: {
    searchQuery: String,
  },
  data() {
    return {
      articles: [],
      currentPage: 1,
      pageSize: 9,
    };
  },
  computed: {
    filteredArticles() {
      if (!this.searchQuery) {
        return this.articles;
      }
      return this.articles.filter(article => 
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredArticles.slice(start, end);
    },
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    fetchArticles() {
      axios.get('http://192.168.44.239:3000/article')
        .then(response => {
          this.articles = response.data;
        })
        .catch(error => {
          console.error('Error fetching articles:', error);
        });
    },
    getImageUrl(relativePath) {
      return `http://192.168.44.239:3000${relativePath}`;
    },
    navigateToArticleDetails(articleId) {
      this.$router.push({ name: 'articleDetails', params: { id: articleId } });
    },
    addNewPostim() {
      this.$router.push('/post');
    },
    confirmDelete(articleId) {
      swal({
        title: 'A jeni i sigurt?',
        text: 'Ky veprim do të fshijë përgjithmonë artikullin!',
        icon: 'warning',
        buttons: ['Anulo', 'Fshij'],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            await axios.delete(`http://192.168.44.239:3000/article/${articleId}`);
            this.articles = this.articles.filter(article => article.articleId !== articleId);
            swal({
              title: 'Fshirë!',
              text: 'Artikulli është fshirë.',
              icon: 'success',
              timer: 3000,
              buttons: false,
            });
          } catch (error) {
            console.error('Error deleting article:', error);
          }
        }
      });
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
.page{
  margin-top: 70px;
}
.article-page {
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.articles-container {
  margin-top: 20px;
}

.articles-list {
  display: grid;
  margin-top: 70px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjusted min-width for responsiveness */
  gap: 90px;
  align-items: start;
}

.article-item {
  margin-bottom: 50px;
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
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 180px;
  padding: 30px;
  background-color: #ffffff;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.85;
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  position: relative;
}

.article-header h3 {
  margin: 0;
  flex: 1;
  text-align: center;
}

.delete-button {
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 0;
  right: 0;
}

.delete-button:hover {
  color: #cc0000;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.custom-article-button {
  margin-top: 10px;

}

.custom-add-postim-button {
  margin-top: 20px;
}
</style>
