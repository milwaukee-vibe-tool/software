import { defineStore } from "pinia";
import { ref } from "vue";

export enum ConnectionStatus {
    Connected,
    Disconnected,
    Connecting,
}

export const useConnectionStore = defineStore("connection", () => {
    const status = ref(ConnectionStatus.Disconnected)
    function connect() {
        // temp
        status.value = ConnectionStatus.Connecting
        setTimeout(() => {
            status.value = ConnectionStatus.Disconnected
        }, 3000)
    }
    return { status, connect }
});
