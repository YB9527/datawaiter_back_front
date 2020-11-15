import Layout from '@/layout'
const beanConfigRouter = {
  path: '/mapperconfig',
  component: Layout,
  redirect: 'noRedirect',
  name: 'mapperconfig',
  children: [
    {
      path: 'index',
      component: () => import('@/_datawaiter/views/mapper/index.vue'),
      name: 'index',
      hidden: true,

    },
  ]
};

export default beanConfigRouter
