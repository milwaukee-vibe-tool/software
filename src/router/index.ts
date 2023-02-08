import { createRouter, createWebHistory } from "vue-router";
import LogView from "../views/LogView.vue";
import SettingsView from "../views/SettingsView.vue";
import StartView from "../views/StartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: StartView,
    },
    {
      path: "/settings",
      component: SettingsView,
    },
    {
      path: "/log/:id",
      children: [
        {
          path: "histogram",
          component: LogView,
        },
        {
          path: "line-graph",
          component: LogView,
        },
      ],
    },
  ],
});

export default router;
