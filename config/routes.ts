export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    key: '/welcome',
    path: '/welcome',
    name: '基础数据看板',
    icon: 'dashboard',
    component: './Welcome',
  },
  {
    key: '/compliance',
    path: '/compliance',
    name: '合规',
    icon: 'apartment',
    routes: [
      { path: '/compliance', redirect: '/compliance/information/database' },
      {
        key: '/compliance/information/database',
        path: '/compliance/information/database',
        name: '合规信息库',
        component: './Compliance/Information/Database',
      },
      {
        key: '/compliance/case',
        path: '/compliance/case',
        name: '合规案例',
        component: './Compliance/Case',
      },
      {
        key: '/compliance/risk',
        path: '/compliance/risk',
        name: '合规风险库',
        component: './Compliance/Risk',
      },
      {
        key: '/compliance/violation',
        path: '/compliance/violation',
        name: '违规行为记录',
        component: './Compliance/ViolationRecord',
      },
      {
        key: '/compliance/comment',
        path: '/compliance/comment',
        name: '留言板',
        component: './Compliance/Comment',
      },
    ],
  },
  {
    key: '/systemConfig',
    path: '/systemConfig',
    name: '系统配置',
    icon: 'control',
    routes: [
      {
        key: '/systemConfig/unit',
        path: '/systemConfig/unit',
        name: '单位信息配置',
        component: './SystemConfig/Unit',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
