import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import Login from "../views/LoginView.vue";
import Register from "../views/RegisterView.vue";
import Home from "../views/Home.vue";
import Welcome from "../components/Welcome.vue";
import UserList from "../components/admin/UserList.vue";

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
    ],
  }, {
    path: "/test",
    component: () => import("@/components/Demo.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
