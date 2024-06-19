<template>
  <div>
    <h2>Artikujt</h2>
    <div v-if="filteredArticles.length === 0">
      <p>No articles found.</p>
    </div>
    <ul v-else>
      <li v-for="article in filteredArticles" :key="article.id">{{ article.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['searchQuery'],
  data() {
    return {
      articles: [
        { id: 1, title: 'Lorem Ipsum' },
        { id: 2, title: 'Vue.js Basics' },
        { id: 3, title: 'State Management with Vuex' },
        { id: 4, title: 'Building Single Page Applications' },
        { id: 5, title: 'Components and Props' },
        { id: 6, title: 'Routing in Vue Router' }
      ]
    };
  },
  computed: {
    filteredArticles() {
      if (!this.searchQuery) {
        return this.articles;
      } else {
        const query = this.searchQuery.toLowerCase();
        return this.articles.filter(article =>
          article.title.toLowerCase().includes(query)
        );
      }
    }
  }
};
</script>

<style scoped>
/* Scoped styles for ArticlesPage.vue */
</style>
