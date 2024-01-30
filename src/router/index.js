import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import {storeToRefs} from "pinia";

import HomeView from '../views/HomeView.vue'
// import Dashboard from '../views/DashBoard.vue'
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import NotFound from '@/components/NotFound.vue';
import Post from '../views/posts/posts.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: false } },
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false } },
  // { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { requiresAuth: false } },

  // posts routes
  { path: '/posts', name: 'posts', component: Post, meta: { requiresAuth: true } },
  { path: '/posts/add', name: 'addPost', component: () => import('../views/posts/addPost.vue'), meta: { requiresAuth: true } },
  { path: '/posts/edit/:slug', name: 'editPost', component: () => import('../views/posts/editPost.vue'), meta: { requiresAuth: true } },
  { path: '/watch/post/:slug', name: 'watchPost', component: () => import('../views/PostShow.vue'), meta: { requiresAuth: true} }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const { authenticated } = storeToRefs(useAuthStore());
  if (to.meta.requiresAuth && !authenticated.value) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
});

export default router
