<template>
  <v-app>
    <v-main>
      <div class="container">
        <h1 class="title">Si mund të ju ndihmojmë?</h1>
        <SearchComponent />
        <ButtonComponent buttonText="Administrator" @customButtonClick="handleCustomButtonClick" />
        <ArticleList v-if="showArticleList" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import SearchComponent from './components/SearchComponent.vue';
import ButtonComponent from './components/ButtonComponent.vue';
import ArticleList from './components/ArticleList.vue';

export default {
  components: {
    SearchComponent,
    ButtonComponent,
    ArticleList
  },
  data() {
    return {
      showArticleList: false
    };
  },
  methods: {
    handleCustomButtonClick() {
      this.showArticleList = true; // Show the article list component
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  height: 70vh;
  padding: 50px; 
  background-color: #1B4D3E; 
  color: #ffffff; 
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px; 
  margin-left: 5px; 
}
</style>
