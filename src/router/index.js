// router.js

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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export function setAuthentication(value) {
  isAuthenticated = value;
  localStorage.setItem('isLoggedIn', value);
}

export default router;
