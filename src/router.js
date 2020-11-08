import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/coin/:id',
      name: 'coin-detail',
      component: () => import('./views/CoinDetail.vue'),
    },
    {
      path: '*',
      name: 'not-found',
      component: () => import('./views/Error.vue'),
    },
  ],
});
