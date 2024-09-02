export default [
  {
    path: '/user',
    layout: false,
    routes: [{path: '/user/login', component: './User/Login'}, {path: '/user/register', component: './User/Register'}]
  },
  {
    hideInMenu: true,path: '/welcome/:id', icon: 'smile', component: './Welcome', name: "首页"},
  {path: '/home', icon: 'home', component: './HomePage', name: "文章列表"},
  {path: '/my/favorites', icon: 'star', component: './MyFavorites', name: "我的收藏",hideInMenu: true},
  {path: '/my/userInfo', icon: 'user', component: './MyUserInfo', name: "个人信息",hideInMenu: true},
  {
    path: '/admin',
    icon: 'crown',
    name: "管理页",
    access: 'canAdmin',
    routes: [
      {path: '/admin', redirect: '/admin/user'},
      {icon: 'table', path: '/admin/user', component: './Admin/User', name: "用户管理"},
    ],
  },
  {path: '/', redirect: '/home'},
  {path: '*', layout: false, component: './404'},
];
