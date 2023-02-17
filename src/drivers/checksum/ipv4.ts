import { concatBytes, convertBytes } from "../../utils/bytes";
import ChecksumDriver from "./checksum";

export default class IPv4Checksum implements ChecksumDriver {
  calculate(bytes: Uint8Array): Uint16Array {
    const values = convertBytes(bytes, Uint16Array);
    let sum = values.reduce((a, b) => a + b, 0);
    while (sum >= 0x10000) {
      sum = Math.floor(sum / 0x10000) + (sum % 0x10000);
    }
    const checksum = new Uint16Array([sum]);
    checksum[0] = ~checksum[0];
    return checksum;
  }
  verify(bytes: Uint8Array, checksum?: Uint16Array): boolean {
    if (checksum != undefined) {
      bytes = concatBytes([bytes, checksum], Uint8Array);
    }
    return this.calculate(bytes)[0] == 0;
  }
}
