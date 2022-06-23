import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {useCookies} from "vue3-cookies";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import Home from "@/views/Home.vue";
import Welcome from "@/components/Welcome.vue";
import UserList from "@/components/admin/UserComponents.vue";
import Sport from "@/components/admin/SportComponents.vue";
import Goods from "@/components/admin/GoodsComponents.vue";
import Introduction from "@/components/user/IntroductionComponents.vue";
import Calories from "@/components/user/CaloriesComponents.vue";
import Subject from "@/components/user/SubjectComponents.vue";
import store from "@/store";
import axios from "@/utils/axios";
import {ElNotification} from "element-plus";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {path: "/welcome", component: Welcome},
      {path: "/user", component: UserList},
      {path: "/sport", component: Sport},
      {path: "/goods", component: Goods},
      {path: "/introduction", component: Introduction},
      {path: "/calories", component: Calories},
      {path: "/subject", component: Subject},
      {path: "/person", component: () => import('@/components/user/PersonComponents.vue')}
    ],
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/NotFound.vue')
  },
  {
    path: '/:pathMath(.*)',
    redirect: "/404"
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 挂载路由导航守卫l
router.beforeEach(async (to, from, next) => {
  // to 将要访问
  // from 从哪访问
  // next 接着干 next(url) 重定向到url上 next() 继续访问 to 路径
  // if (to.path === "/login") return next();
  // if (to.path === "/register") return next();
  // 获取user
  // const userFlag = window.sessionStorage.getItem("username");// 取出当前用户
  // const userFlag = store.getters.getUserInfo.username;// 取出当前用户
  const {cookies} = useCookies();
  const token = cookies.get("token");
  if (!token) {
    if (to.path === "/login") return next();
    if (to.path === "/register") return next();
    return next("/login");//无值，返回登录页
  } else {
    if (to.path === "/login") {
      // console.log("from",from)
      const {data: res} = await axios.post("/isLogin");
      if (res.code === 200) {
        store.commit("setUserInfo", res.data);
        return next('/home');
      } else {
        ElNotification({type: "error", title: "提示", message: "token 失效了"})
        return next("/login");
      }
    }
  }
  next();// 符合要求 放行
});

export default router;
