import { createRouter, createWebHistory } from "vue-router";
import FileSystemLogView from "../views/FileSystemLogView.vue";
import BluetoothLogView from "../views/BluetoothLogView.vue";
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
      path: "/filesystem/log/:logId",
      name: "filesystem/log",
      component: FileSystemLogView,
    },
    {
      path: "/bluetooth/log/:logId",
      name: "bluetooth/log",
      component: BluetoothLogView,
    },
  ],
});

export default router;
