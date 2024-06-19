<template>
  <ArticlePageVue/>
  <VideoPage/>
  <QuestionPage/>
</template>

<script>
import ArticlePageVue from './ArticlePage.vue'
import VideoPage from "../User/VideoPage.vue"
import QuestionPage from "./QuestionPage.vue"

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