<template>
  <v-app>
    <v-main>
      <div class="container">
        <h1 class="title">Si mund të ju ndihmojmë?</h1>
        <SearchComponent />
        <ButtonComponent buttonText="Administrator" @click="handleCustomButtonClick" />
       
      </div>
      <div class="hero">
        <div class="slider">
          <button
            v-for="(item, index) in items"
            :key="index"
            :class="{ active: currentIndex === index }"
            @click="handleSliderClick(index)"
          >
            {{ item.label }}
          </button>
        </div>
        <component :is="currentComponent" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import SearchComponent from '../components/SearchComponent.vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ArticlesPage from '../views/ArticlePage.vue';
import QuestionsPage from '../views/QuestionPage.vue';
import VideosPage from '../views/VideoPage.vue';
import AdminPage from '../views/AdminPage.vue';

export default {
  components: {
    SearchComponent,
    ButtonComponent,
    ArticlesPage,
    QuestionsPage,
    VideosPage,
    AdminPage,
  },
  data() {
    return {
      currentIndex: 0,
      items: [
        { label: 'Articles' },
        { label: 'Questions' },
        { label: 'Videos' }
      ],
      currentComponent: 'ArticlesPage'
    };
  },
  methods: {
    handleCustomButtonClick() {
      this.$router.push({ path: '/administrator' });
    },
    handleSliderClick(index) {
      this.currentIndex = index;
      const components = ['ArticlesPage', 'QuestionsPage', 'VideosPage'];
      this.currentComponent = components[index];
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

.slider {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;

}

button.active {
  border-bottom: 2px solid #ffffff;
}
</style>
