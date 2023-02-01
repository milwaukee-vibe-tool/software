<script setup lang="ts">
import { ref } from 'vue';

const drawerOpen = ref(false)

function drawerToggle() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<template>
  <q-layout view="lHh lpr fFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawerToggle" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
