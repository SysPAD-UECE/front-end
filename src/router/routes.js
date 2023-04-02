const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') }
    ]
  },
  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'home', component: () => import('pages/Home.vue') },
      { path: 'databases', component: () => import('pages/Databases.vue') },
      { path: 'anonymization',
      children: [
        { path: 'databases', name: 'anonymization-database-picker', component: () => import('src/pages/AnonymizationDatabasePicker.vue') },
        { path: 'tables', name: 'anonymitazation-table-picker', component: () => import('src/pages/AnonymizationTablePicker.vue'), }
      ],
      redirect: './client/anonymization/databases'},
    ],
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
          { path: '', component: () => import('pages/Users.vue') },
          { path: 'new', component: () => import('pages/addUser.vue') }
        ]
      }
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
