import { createRouter, createWebHistory } from 'vue-router'

import ArticleList from "../components/ArticleList"



const routes = [


  {
    path: '/article',
    name: 'article',
    component: ArticleList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
