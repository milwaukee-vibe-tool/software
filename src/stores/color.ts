import { defineStore } from "pinia";
import { useQuasar } from "quasar";
import { ref } from "vue";

export const useColorStore = defineStore("color", () => {
  const $q = useQuasar();

  const darkMode = ref(false);
  $q.dark.set(darkMode.value);

  function setDarkMode(value: boolean) {
    darkMode.value = value;
    $q.dark.set(value);
  }

  return { darkMode, setDarkMode };
});
