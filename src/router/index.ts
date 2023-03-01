import { createRouter, createWebHistory } from "vue-router";
import LogView from "../views/LogView.vue";
import SettingsView from "../views/SettingsView.vue";
import StartView from "../views/StartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "start",
      component: StartView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/log/:logId",
      name: "log",
      component: LogView,
    },
  ],
});

export default router;
