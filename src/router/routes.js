const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'start-page', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      { path: '/forgot', name: 'forgot-password', component: () => import('pages/ForgotPassword.vue') },
      { path: '/forgot-password', name: 'change-password', component: () => import('pages/ChangePassword.vue') },
      { path: '/user-activation', name: 'user-activation', component: () => import('pages/ActivateUser.vue') }
    ]
  },

  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Databases.vue') },
      { path: 'home', name: 'home', component: () => import('pages/Databases.vue') },
      { path: 'databases', component: () => import('pages/Databases.vue') },
      {
        path: 'anonymization',
        children: [
          { path: 'databases', name: 'anonymization-database-picker', component: () => import('src/pages/AnonymizationDatabasePicker.vue') },
          { path: 'tables', name: 'anonymitazation-table-picker', component: () => import('src/pages/AnonymizationTablePicker.vue'), },
          { path: 'columns', name:'columnsTable' ,component: () => import('src/pages/ColumnsTable.vue'), }
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
