import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/User/HomeView.vue'
import AdministratorView from "@/views/Admin/AdministratorView"
import AdminView from "@/views/Admin/AdminPage.vue"
import NotFound from "../components/ErrorPage.vue"  
import HomeViewAdmin from "@/views/Admin/HomeViewAdmin"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/homeadmin',
    name: 'homeadmin',
    component: HomeViewAdmin
  },
  {
    path: '/administrator',
    name: 'administrator',
    component: AdministratorView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/:pathMatch(.*)*',  
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
