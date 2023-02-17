import { Request } from "../../protobuf/build/typescript/protos/request";
import { concatBytes, convertBytes } from "../../utils/bytes";
import ChecksumDriver from "../checksum/checksum";
import IPv4Checksum from "../checksum/ipv4";

const checksumDriver: ChecksumDriver = new IPv4Checksum();

export function convertRequestToBytes(request: Request): Uint8Array {
  const payload = Request.encode(request).finish();
  const length = new Uint16Array([payload.length]);
  const checksum = new Uint16Array(
    checksumDriver.calculate(concatBytes([length, payload], Uint8Array))
  );
  return concatBytes([length, payload, checksum], Uint8Array);
}

export function convertBytesToRequest(bytes: Uint8Array): Request {
  if (!checksumDriver.verify(bytes)) {
    throw new Error("Checksum verification failed");
  }
  const length = convertBytes(bytes.slice(0, 2), Uint16Array);
  const payload = bytes.slice(2, length[0]);
  return Request.decode(payload);
}
