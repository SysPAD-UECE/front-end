
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Register.vue') }
    ]
  },
  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Databases.vue') },
      {
        path: 'databases',
        children: [
          { path: '', component: () => import('pages/Databases.vue') }
        ]
      }
    ]
  },
  {
    path: '/token',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Token.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Users.vue') },
      {
        path: 'users',
        children: [
          { path: '', component: () => import('pages/Users.vue') },
          { path: 'new', component: () => import('pages/addUser.vue') }
        ]
      }
    ]
  },
  {
    path: '/anonymization',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/BeforeAnon.vue') },
      {
        path: 'before',
        children: [
          { path: '', component: () => import('pages/BeforeAnon.vue') },
        ]
      },
      {
        path: 'after',
        children: [
          { path: '', component: () => import('pages/AfterAnon.vue') },
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
