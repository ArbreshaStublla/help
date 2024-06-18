<template>
    <v-app>
      <v-main>
        <div class="container">
          <h1 class="title">Si mund të ju ndihmojmë?</h1>
          <SearchComponent />
       
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
          <component :is="currentComponent" />
          </v-container>
        </div>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import SearchComponent from '../components/SearchComponent.vue';
  import ButtonComponent from '../components/ButtonComponent.vue';
  import ArticlesPage from '../views/ArticlePage.vue';
  import QuestionsPage from '../views/QuestionPage.vue';
  import VideoAdmin from '../views/VideoAdmin.vue';
  import AdminPage from '../views/AdminPage.vue';
  
  export default {
    components: {
      SearchComponent,
      ButtonComponent,
      ArticlesPage,
      QuestionsPage,
      VideoAdmin,
      AdminPage,
    },
    data() {
      return {
        currentIndex: 0,
        items: [
          { label: 'Artikujt' },
          { label: 'Pyetjet' },
          { label: 'Videot' }
        ],
        currentComponent: 'ArticlesPage'
      };
    },
    methods: {
     
      handleSliderClick(index) {
        this.currentIndex = index;
        const components = ['ArticlesPage', 'QuestionsPage', 'VideoAdmin'];
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
  background-image: url(../assets/18.png); 
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
    transition: border-color 0.3s;
  }
  
  button.active {
    border-bottom: 2px solid #1B4D3E;
  }
  </style>
  