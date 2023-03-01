<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer.toggle" />
        <q-toolbar-title>Milwaukee Vibe Tool</q-toolbar-title>
        <Connection class="q-mx-md" />
        <q-btn dense flat round icon="settings" to="/settings" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer.open" side="left" bordered>
      <LogList />
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.path"></component>
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Connection from "./components/Connection.vue";
import LogList from "./components/LogList.vue";
import { useDrawerStore } from "./stores/drawer";

export default {
  setup() {
    const drawer = useDrawerStore();
    return { drawer };
  },
  components: {
    Connection,
    LogList,
  },
};
</script>
