export const routes = [{
    path: '/register',
    name: 'Register',
    component: (r) => require(['../views/Register.vue'], r)
  },
  {
    path: '/login',
    name: 'Login',
    component: (r) => require(['../views/Login.vue'], r)
  },
  {
    path: '/main',
    name: 'Main',

    //懒加载组件
    component: r => require(['../views/Main.vue'], r),
    children: [{
        path: 'type',
        name: 'Type',
        component: r => require(['../views/Type.vue'], r)
      }, {
        path: 'products',
        name: 'Products',
        component: r => require(['../views/Products.vue'], r)
      },
      {
        path: 'pro/:id/:pid?',
        name: 'Pro',
        component: r => require(['../views/Pro.vue'], r)
      }, {
        path: 'user',
        name: 'User',
        component: r => require(['../views/User.vue'], r)
      }, {
        // ProductStatistics
        path: 'order',
        name: 'Order',
        component: r => require(['../views/Order.vue'], r)
      }, {
        path: 'checkOrder/:id/:oredrId?',
        name: 'CheckOrder',
        component: r => require(['../views/CheckOrder.vue'], r)
      }, {
        // OrderStatistics
        path: 'productStatistics',
        name: 'ProductStatistics',
        component: r => require(['../views/ProductStatistics.vue'], r)
      },
      {
        // OrderStatistics
        path: 'orderStatistics',
        name: 'OrderStatistics',
        component: r => require(['../views/OrderStatistics.vue'], r)
      },

    ]
  },
  {
    path: '*',
    redirect: {
      name: 'Register'
    }
  }
]