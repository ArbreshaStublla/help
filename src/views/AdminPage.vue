<template>
  <ArticlePageVue/>
  <VideoPage/>
  <QuestionPage/>
</template>

<script>
import ArticlePageVue from '../views/ArticlePage.vue'
import VideoPage from "../views/VideoPage.vue"
import QuestionPage from "../views/QuestionPage.vue"

export default {
components:{
    ArticlePageVue,
    VideoPage,
    QuestionPage
}
}
</script>

<style>

</style>