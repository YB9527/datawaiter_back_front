import Layout from '@/layout'


const userRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'sys',
  meta: {
    title: '系统管理',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/_datawaiter/views/user/userManager'),
      name: 'user',
      meta: { title: '用户管理', noCache: true }
    },
  ]
}

export default userRouter
