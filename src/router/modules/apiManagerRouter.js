import Layout from '@/layout'
const apiManagerRouter = {
  path: '/source',
  component: Layout,
  redirect: 'noRedirect',
  name: 'source',
  meta: {
    title: '资源管理',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/_datawaiter/views/api/index.vue'),
      name: 'index',
      meta: { title: 'API', noCache: true }
    },
  ]
};

export default apiManagerRouter
