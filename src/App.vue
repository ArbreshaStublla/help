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
