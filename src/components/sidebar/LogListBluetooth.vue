<template>
  <q-list>
    <q-item> Hello world, and welcome to the file list. </q-item>

    <q-item>
      <q-btn
        @click="refreshLogs"
        color="primary"
        :loading="state === State.LOADING"
      >
        Refresh
      </q-btn>
    </q-item>

    <q-item>
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
    </q-item>

    <q-separator spaced />
    <q-item-label header>Files</q-item-label>

    <q-infinite-scroll ref="infiniteScroll" @load="loadLogs">
      <q-list>
        <q-item v-for="log in logs" clickable v-ripple @click="redirect(log)">
          <q-item-section>
            <q-item-label>yaya{{ log }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div>
              <q-btn flat dense round icon="download"></q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                @click="deleteLog(log)"
              ></q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-infinite-scroll>
  </q-list>

  <status-overlay
    :loading="state === State.LOADING"
    :error="state === State.ERROR"
    @refresh="refreshLogs"
  />
</template>

<script setup lang="ts">
import { QInfiniteScroll } from "quasar";
import { ref } from "vue";
import { ConnectionStatus, useConnectionStore } from "../../stores/connection";
import StatusOverlay from "../StatusOverlay.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

connectionStore.$subscribe(() => {
  switch (connectionStore.status) {
    case ConnectionStatus.Connected:
      if (state.value === State.ERROR) refreshLogs();
      break;
    case ConnectionStatus.Disconnected:
      if (state.value === State.LOADED) state.value = State.ERROR;
      break;
  }
});

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

function redirect(log: string) {
  // todo: use same view query param, if exists
  // let currentPath = router.currentRoute.value.path;
  router.push({
    name: "log",
    params: { logId: log },
    query: { view: "line-graph" },
  });
}
</script>