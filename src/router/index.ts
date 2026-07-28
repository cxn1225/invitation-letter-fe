import StaticInviteView from '@/views/invite/StaticInviteView.vue'
import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const constance: RouteRecordRaw[] = [
  {
    path: '/invite/:slug',
    name: 'static-invite',
    component: StaticInviteView,
    meta: { title: '活动邀请函' },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/dashboard/dashboard.vue"),
    meta: { title: "首页" },
  }
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
