<template>
  <q-list>
    <q-item-label header>Interface Settings</q-item-label>
    <q-item>
      <q-item-section>Dark Mode</q-item-section>
      <q-item-section side top>
        <q-toggle
          :model-value="colorStore.darkMode"
          @update:model-value="colorStore.setDarkMode"
        ></q-toggle>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item-label header>Device Settings</q-item-label>
  </q-list>
</template>

<script setup lang="ts">
import { useColorStore } from "../stores/color";

const colorStore = useColorStore();
</script>
