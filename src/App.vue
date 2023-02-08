<template>
  <q-layout view="hHh lpr fFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer.toggle" />
        <q-toolbar-title>Milwaukee Vibe Tool</q-toolbar-title>
        <Connection class="q-mx-md" />
        <q-btn dense flat round icon="settings" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer.open" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import Connection from './components/Connection.vue';
import { useDrawerStore } from './stores/drawer';

export default {
  setup() {
    const drawer = useDrawerStore()
    return { drawer }
  },
  components: {
    Connection,
  }
}
</script>
