<template>
  <v-app>
    <v-main>
      <ArticleList/>
      <router-view/>

    </v-main>
  </v-app>
</template>

<script>
import ArticleList from './components/ArticleList.vue';
export default {
  components:{
    ArticleList
  },
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
<style scoped>
* {
  background-color: #F5F7F9 !important;
}
</style>
