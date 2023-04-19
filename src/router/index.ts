import { createRouter, createWebHistory } from "vue-router";
import FileSystemLogView from "../views/FileSystemLogView.vue";
import BluetoothLogView from "../views/BluetoothLogView.vue";
import SettingsView from "../views/SettingsView.vue";
import StartView from "../views/StartView.vue";
import Error404View from "../views/Error404View.vue";

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
      path: "/filesystem/log/:logId/:view",
      name: "filesystem/log",
      component: FileSystemLogView,
    },
    {
      path: "/bluetooth/:view",
      name: "bluetooth",
      component: BluetoothLogView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error404",
      component: Error404View,
    },
  ],
});

export default router;
