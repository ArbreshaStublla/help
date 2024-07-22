import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/User/HomeView.vue';
import AdministratorView from "@/views/Admin/AdministratorView.vue";
import AdminView from "@/views/Admin/AdminPage.vue";
import NotFound from "../components/ErrorPage.vue";
import HomeViewAdmin from "@/views/Admin/HomeViewAdmin.vue";
import ArticleDetails from "../views/Admin/ArticleDetails.vue";
import ArticleDetail from "../views/User/ArticleDetail.vue" 
import EditArticle from "../components/EditArticle.vue"
import PostArticle from "../views/Admin/ArticlePost.vue"


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/homeadmin',
    name: 'homeadmin',
    component: HomeViewAdmin,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: AdministratorView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/article/:id', 
    name: 'articleDetails',
    component: ArticleDetails,
    props: true,
    meta: { requiresAuth: true }
    
  },
  {
    path: '/article/:id', 
    name: 'articleDetail',
    component: ArticleDetail,
    props: true,
  
    
  },
  {
    path: '/edit/:id', 
    name: 'editArticle',
    component: EditArticle,
    props: true ,
    meta: { requiresAuth: true }
  },
  {
    path: '/post', 
    name: 'post',
    component: PostArticle,
    props: true ,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

let isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';


export function setAuthentication(value) {
  isAuthenticated = value;
  localStorage.setItem('isLoggedIn', value); 
}


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
