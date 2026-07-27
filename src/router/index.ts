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

router.beforeEach((to, from, next) => {
  // 如果是登录页或者404等其他白名单页面，直接放行
  if (whiteRoutes.includes(to.path)) {
    return next();
  }

  const userStore = useUserStore();
  if (!userStore.accessToken) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  // 上述条件都不满足，放行
  return next();
});
router.afterEach((to: RouteLocationNormalized) => {
  document.title = to.meta.title || "";
});

export default router;
