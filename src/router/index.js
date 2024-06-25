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
    meta: { requiresAuth: true } // Add meta field for authentication check
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
    next('/administrator'); // Redirect to login if not authenticated and trying to access protected routes
  } else {
    next(); // Continue to the requested route
  }
});

export function setAuthentication(value) {
  isAuthenticated = value;
}

export default router;
