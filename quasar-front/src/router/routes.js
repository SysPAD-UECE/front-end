const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue')}
    ]
  },
  {
    path: '/client',
    meta: { requiresAuth: true },
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Databases.vue') },
      { path: 'databases', component: () => import('pages/Databases.vue') },
      { path: 'token', component: () => import('pages/Token.vue')},
      // path: 'anonymization', component: () => import ('pages/anonymization.vue')},
      { path: 'anonymizationconfig', component: () => import('pages/anonymizationConfig.vue')}
    ]
    // , meta: {
    //  requiresAuth: true
    // }
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Users.vue') },
      { path: 'new', component: () => import('pages/addUser.vue') }
    ]
  },
  // {
  //   path: '/anonymization',
  //   component: () => import('layouts/ClientLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/BeforeAnon.vue') },
  //     {
  //       path: 'before',
  //       children: [
  //         { path: '', component: () => import('pages/BeforeAnon.vue') },
  //       ]
  //     },
  //     {
  //       path: 'after',
  //       children: [
  //         { path: '', component: () => import('pages/AfterAnon.vue') },
  //       ]
  //     }
  //   ]
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
