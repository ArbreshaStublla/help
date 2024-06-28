<template>
  <div class="forma1">
    <div class="article-list">
      <div
        v-for="(article, index) in paginatedArticles"
        :key="article.articleId"
        class="article-item"
        :class="{ 'second-in-row': index % 2 !== 0 }"
      >
        <div class="article-image-container">
          <img
            v-if="article.photo_path"
            :src="`http://192.168.44.239:3000/${article.photo_path}`"
            :alt="article.title + ' Photo'"
            class="article-image"
          />
          <img src="placeholder.jpg" alt="Placeholder Image" class="article-image" v-else />
        </div>
        <div class="article-content-right">
          <h3>{{ article.title }}</h3>
          <p><strong>Category:</strong> {{ article.category }}</p>
          <p>{{ article.content }}</p>
        </div>
      </div>
    </div>
    <PaginationComponent
      :items="articles"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChanged="handlePageChange"
    />
  </div>
</template>

<script>
import axios from 'axios';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
  components: {
    PaginationComponent,
  },
  data() {
    return {
      articles: [],
      currentPage: 1,
      pageSize: 6,
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}article/`);
        this.articles = response.data;
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
  computed: {
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.articles.slice(start, end);
    },
  },
  created() {
    this.fetchArticles();
  },
};
</script>

<style scoped>
.forma1 {
  margin-top: 30px;
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
  flex-direction: column; 
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  width: 100%; 
}

.article-item.second-in-row {
  margin-right: auto;
}

.article-image-container {
  flex: 0 0 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-image {
  width: 100%;
  height: auto;
  object-fit: cover;
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

@media (min-width: 600px) {
  .article-item {
    flex-direction: row; 
  }

  .article-item:nth-child(odd) {
    margin-right: 20px; 
  }
}
</style>
