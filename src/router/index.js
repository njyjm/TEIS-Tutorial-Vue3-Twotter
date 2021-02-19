import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import { users } from "../assets/users";
import Home from '../views/Home.vue'
import UserProfile from "../views/UserProfile";
import Admin from "../views/Admin";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const user = store.state.User.user;
 
  // store 状态变量中保存当前的用户
  if (!user) {
    await store.dispatch('User/setUser', users[0]);
  }else if(to.fullPath.includes('/user/') & user.id != to.params.userId){
    await store.dispatch('User/setUser', users[to.params.userId - 1]);
  }
 
  // 得到用户的当前权限
  const isAdmin = user?user.isAdmin:false;
 
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAdmin && !isAdmin) next({ name: 'Home' });
  else next();
})

export default router
