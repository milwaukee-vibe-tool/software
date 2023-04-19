import Emittery from "emittery";
import SerialDriver, {
  SerialEventTopic,
  SerialEventHandler,
  ErrorNotConnected,
} from "./serial";

const bleService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleCharacteristicTx = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleCharacteristicRx = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const characteristicSize = 20;

export class SerialNordicUartWebBluetooth implements SerialDriver {
  emitter: Emittery;
  device: BluetoothDevice | null;
  service: BluetoothRemoteGATTService | null;
  characteristicRx: BluetoothRemoteGATTCharacteristic | null;
  characteristicTx: BluetoothRemoteGATTCharacteristic | null;

  constructor() {
    this.emitter = new Emittery();
    this.device = null;
    this.service = null;
    this.characteristicRx = null;
    this.characteristicTx = null;
  }

  async connect() {
    if (!navigator.bluetooth) {
      alert(
        "The Web Bluetooth API is not available, please use a supported browser."
      );
      return;
    }

    if (this.device && this.device.gatt?.connected) {
      this.disconnect();
    }

    await navigator.bluetooth
      .requestDevice({
        optionalServices: [bleService],
        acceptAllDevices: true,
      })
      .then((device) => {
        this.device = device;
        console.log(`Connected to device '${device.name}'`);
        this.device.addEventListener("gattserverdisconnected", () =>
          this.disconnect()
        );
        return this.device.gatt?.connect();
      })
      .then((server) => {
        return server?.getPrimaryService(bleService);
      })
      .then((service) => {
        this.service = service!;
        return Promise.all([
          this.service.getCharacteristic(bleCharacteristicRx),
          this.service.getCharacteristic(bleCharacteristicTx),
        ]);
      })
      .then((characteristics) => {
        this.characteristicRx = characteristics[0];
        this.characteristicTx = characteristics[1];
        return this.characteristicRx.startNotifications();
      })
      .then(() => {
        this.characteristicRx?.addEventListener(
          "characteristicvaluechanged",
          (event) => this.receive(event)
        );
      })
      .catch((reason) => {
        this.disconnect();
        throw new Error(`Failed to connect because ${reason}`);
      });
  }

  async disconnect() {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.service = null;
    this.characteristicRx = null;
    this.characteristicTx = null;
    this.emitter.emit(SerialEventTopic.Disconnected, {
      topic: SerialEventTopic.Disconnected,
    });
  }

  subscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.on(topic, handler);
  }

  unsubscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.off(topic, handler);
  }

  async transmit(bytes: Uint8Array) {
    if (!this.device || !this.device.gatt?.connected) {
      throw ErrorNotConnected;
    }

    for (let index = 0; index < bytes.length; index += characteristicSize) {
      this.characteristicTx?.writeValue(
        bytes.slice(index, index + characteristicSize)
      );
    }
  }

  receive(event: Event) {
    let dataview = (<BluetoothRemoteGATTCharacteristic>event.target).value!;
    let bytes = new Uint8Array(
      dataview.buffer,
      dataview.byteOffset,
      dataview.byteLength
    );
    this.emitter.emit(SerialEventTopic.Received, {
      topic: SerialEventTopic.Received,
      data: { bytes: bytes },
    });
  }
}
