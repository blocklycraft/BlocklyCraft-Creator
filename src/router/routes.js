
const routes = [
  {
    path: '/',
    component: () => import('layouts/layouts.vue'),
    children:[
      {
        path:'/',
        component: () => import('pages/index.vue')
      }
    ]

  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/layouts.vue')
  })
}

export default routes
