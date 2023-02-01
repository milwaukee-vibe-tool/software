import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/StartView.vue"),
    },
    {
      path: "/settings",
      component: () => import("../views/SettingsView.vue"),
    },
    {
      path: "/log/:log-name",
      component: () => import("../views/LogView.vue"),
      children: [
        {
          path: "histogram",
          component: () => import("../views/HistogramView.vue"),
        },
        {
          path: "line-chart",
          component: () => import("../views/LineChartView.vue"),
        },
      ],
    },
  ],
});

export default router;
