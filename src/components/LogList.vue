<template>
  Hello world, and welcome to the file list.

  <q-btn
    @click="refreshLogs"
    color="primary"
    :loading="state === State.LOADING"
  >
    Refresh
  </q-btn>

  <!-- <q-dialog :v-model="state === State.ERROR">ah</q-dialog> -->

  <q-input
    filled
    v-model="newLogName"
    :label="prefix + '_'"
    counter
    maxlength="20"
  >
    <template v-slot:hint>New Log Name</template>

    <template v-slot:append>
      <q-icon
        v-if="newLogName != ''"
        name="close"
        @click="newLogName = ''"
        class="cursor-pointer"
      />
    </template>

    <template v-slot:after>
      <q-btn round dense flat icon="send" />
    </template>
  </q-input>

  <q-infinite-scroll ref="infiniteScroll" @load="loadLogs">
    <q-list>
      <q-item v-for="log in logs">
        <q-item-section>
          <q-item-label>yaya{{ log }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-infinite-scroll>

  <loading-overlay :show="state === State.LOADING" />
  <error-overlay :show="state === State.ERROR" :refresh="refreshLogs" />
</template>

<script setup lang="ts">
import { QInfiniteScroll } from "quasar";
import { ref } from "vue";
import { useConnectionStore } from "../stores/connection";
import ErrorOverlay from "./ErrorOverlay.vue";
import LoadingOverlay from "./LoadingOverlay.vue";

const connectionStore = useConnectionStore();

const THROTTLE = 20;

enum State {
  LOADED,
  LOADING,
  ERROR,
}

const state = ref(State.LOADING);
const logs = ref<string[]>([]);
const prefix = ref(0);
const infiniteScroll = ref<QInfiniteScroll | null>(null);
const newLogName = ref("");

async function refreshLogs() {
  state.value = State.LOADING;
  logs.value = [];
  infiniteScroll.value?.resume();
}

async function loadLogs(_: number, done: (stop: boolean) => void) {
  try {
    let payload = await connectionStore.send({
      listLogs: { offset: logs.value.length, count: THROTTLE },
    });

    let response = payload.logList;
    if (response == undefined) throw new Error("Bad response");

    if (logs.value.length != response.offset) throw new Error("Index mismatch");

    prefix.value = response.prefix;
    logs.value = logs.value.concat(response.logs.map((entry) => entry.logId));
    done(response.logs.length < THROTTLE);
  } catch (e) {
    state.value = State.ERROR;
    done(true);
    throw e;
  }
  state.value = State.LOADED;
}

async function newLog(logId: string) {
  state.value = State.LOADING;
  try {
    await connectionStore.send({ newLog: { logId: logId, sampleRate: 0 } });
  } catch (e) {
    state.value = State.ERROR;
    throw e;
  }
  await refreshLogs();
}

async function deleteLog(logId: string) {
  state.value = State.LOADING;
  try {
    await connectionStore.send({ deleteLog: { logId: logId } });
  } catch (e) {
    state.value = State.ERROR;
    throw e;
  }
  await refreshLogs();
}
</script>
