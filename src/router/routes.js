const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'start-page', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      { path: '/forgot-password', name: 'forgot-password', component: () => import('pages/ForgotPassword.vue') },
      { path: '/change-password', name: 'change-password', component: () => import('pages/ChangePassword.vue') },
    ]
  },

  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'home', name: 'home', component: () => import('pages/Home.vue') },
      { path: 'databases', component: () => import('pages/Databases.vue') },
      {
        path: 'anonymization',
        children: [
          { path: 'databases', name: 'anonymization-database-picker', component: () => import('src/pages/AnonymizationDatabasePicker.vue') },
          { path: 'tables', name: 'anonymitazation-table-picker', component: () => import('src/pages/AnonymizationTablePicker.vue'), }
        ],
        redirect: './client/anonymization/databases'
      },
    ],
    meta: {
      requiresAuth: true
    },
    redirect: './client/databases'
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Users.vue') },
      {
        path: 'user',
        children: [
          { path: '', name: 'admin', component: () => import('pages/Users.vue') },
          { path: 'new', component: () => import('pages/addUser.vue') }
        ]
      }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
