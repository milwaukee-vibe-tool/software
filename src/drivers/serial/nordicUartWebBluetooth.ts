import SerialDriver from "./serial";

export class SerialNordicUartWebBluetooth implements SerialDriver {
  connect() {
    console.log("printing from nordic uart web bluetooth");
  }
}
