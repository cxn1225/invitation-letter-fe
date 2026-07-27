import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { whiteRoutes } from "@/utils/config";

const constance: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/dashboard/dashboard.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
    meta: { title: "登录" },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: constance,
  scrollBehavior() {
    return { top: 0 };
  },
});


router.afterEach((to: RouteLocationNormalized) => {
  document.title = to.meta.title || "";
});

export default router;
