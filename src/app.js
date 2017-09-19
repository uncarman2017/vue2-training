import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from '@/components/App.vue';
import { createStore } from '@/store';
import { createRouter } from '@/router';

export function createApp() {
  // create store and router instances
  const store = createStore();
  const router = createRouter();

  sync(store, router);

  // create the app instance
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });

  // expose the app, the router and the store.
  return { app, router, store };
}