import SerialDriver from "./serial";

export class SerialMock implements SerialDriver {
  connect() {
    console.log("printing from nordic uart web bluetooth");
  }
}
