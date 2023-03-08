<template>
  <q-list>
    <q-item
      v-for="(log, index) in props.logs"
      clickable
      v-ripple
      @click="$emit('navigate', index)"
    >
      <q-item-section>
        <!-- <q-item-label>{{ log }}</q-item-label> -->
        <q-field standout dense readonly>
          <template v-slot:control>
            <div class="self-center full-width no-outline">
              {{ log }}
            </div>
          </template>
        </q-field>
      </q-item-section>
      <q-item-section side>
        <div>
          <q-btn
            flat
            dense
            round
            icon="download"
            @click="$emit('download', index)"
          ></q-btn>
          <q-btn
            flat
            dense
            round
            icon="delete"
            @click="$emit('remove', index)"
          ></q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
const props = defineProps<{
  logs: string[];
}>();

const emits = defineEmits(["remove", "download", "navigate"]);
</script>
