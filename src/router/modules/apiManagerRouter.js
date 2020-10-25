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
      path: 'sourcemanager',
      component: () => import('@/_datawaiter/views/api/sourceManager.vue'),
      name: 'sourcemanager',
      meta: { title: 'API', noCache: true }
    },
  ]
};

export default apiManagerRouter
