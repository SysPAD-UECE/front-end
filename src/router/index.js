import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory, routerKey } from 'vue-router'
import routes from './routes'
import useAuthUser from 'src/composables/UseAuthUser'
import { nextTick } from 'vue'



export default route(function ( { store, ssrContext } ) {

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)


  })

  Router.beforeEach((to) => {
    const isLoggedIn = store.state.auth.isAuthenticated;
    console.log(isLoggedIn)

    if (!isLoggedIn && to.meta.requiresAuth) {
      return { name: 'login' }
    } else if (isLoggedIn && (to.name === 'login' || to.name === 'start-page')) {
      return { name: 'home' }
    }
  })

  return Router;
})
