<template>
  <v-app>
    <v-main>
      <div class="top-bar">
        <ButtonComponent buttonText="Shkyçu" @click="handleLogout" />
      </div>
      <div class="container">
        <h1 class="title">Si mund të ju ndihmojmë?</h1>
        <SearchComponent @search="handleSearch" />
      </div>
      <div class="hero">
        <v-container>
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
          <component :is="currentComponent" :searchQuery="searchQuery" />
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import SearchComponent from '../../components/SearchComponent.vue';
import ButtonComponent from '../../components/ButtonComponent.vue'; 

import ArticlesPage from './ArticlePage.vue';
import QuestionsPage from '../Admin/QuestionPage.vue';
import VideosPage from '../Admin/VideoAdmin.vue';

export default {
  components: {
    SearchComponent,
    ButtonComponent, 
    ArticlesPage,
    QuestionsPage,
    VideosPage,
  },
  computed: mapState(['searchQuery']),
  data() {
    return {
      currentIndex: 0,
      items: [
        { label: 'Postime' },
        { label: 'Pyetje' },
        { label: 'Udhëzime' }
      ],
      currentComponent: 'ArticlesPage' 
    };
  },
  methods: {
    handleSliderClick(index) {
      this.currentIndex = index;
      const components = ['ArticlesPage', 'QuestionsPage', 'VideosPage'];
      this.currentComponent = components[index];
    },
    handleSearch(query) {
      console.log('Search query:', query);
      this.$store.commit('updateSearchQuery', query);
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn'); 
      this.$store.commit('updateSearchQuery', ''); 
      this.$router.push('/'); 
    }
  }
};
</script>


<style scoped>
.top-bar {
  display: flex;
  justify-content: flex-end;
  background-color: #f5f5f5;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 55vh;
  padding: 50px;
  background-image: url(../../assets/background.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  width: 100%;
  margin-top: 20px;
}

button {
  flex-grow: 1;
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  border-bottom: 2px solid transparent;
  transition: border-bottom 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

button.active {
  border-bottom: 2px solid #00008B;
}
</style>
