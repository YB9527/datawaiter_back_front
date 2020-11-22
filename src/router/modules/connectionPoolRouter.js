import Layout from '@/layout'
const connectionPoolRouter = {
  path: '/connectionpool',
  component: Layout,
  redirect: 'noRedirect',
  name: 'connectionpool',
  meta: {
    title: '连接池管理',
    icon: 'el-icon-s-operation'
  },
  children: [
    {
      path: 'connectionpool',
      component: () => import('@/_datawaiter/views/database/connectionPool.vue'),
      name: 'connectionpool',
      meta: { title: '连接池管理', noCache: true },
    },
    {
      path: 'mapperconfig',
      component: () => import('@/_datawaiter/views/mapper/index.vue'),
      name: 'mapperconfig',
      hidden: true,
    },
  ]
};

export default connectionPoolRouter
