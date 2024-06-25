import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/User/HomeView.vue';
import AdministratorView from "@/views/Admin/AdministratorView.vue";
import AdminView from "@/views/Admin/AdminPage.vue";
import NotFound from "../components/ErrorPage.vue";
import HomeViewAdmin from "@/views/Admin/HomeViewAdmin.vue";

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
    path: '/administrator',
    name: 'administrator',
    component: AdministratorView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
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

let isAuthenticated = false;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/administrator'); 
  } else {
    next(); 
  }
});

export function setAuthentication(value) {
  isAuthenticated = value;
}

export default router;
