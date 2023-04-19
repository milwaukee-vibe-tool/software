import { Request } from "../../protobuf/build/typescript/protos/request";
import { Response } from "../../protobuf/build/typescript/protos/response";
import { concatBytes, convertBytes } from "../../utils/bytes";
import ChecksumDriver from "../checksum/checksum";
import IPv4Checksum from "../checksum/ipv4";

const HEADER_START = new Uint16Array([0x0045]);
const HEADER_SIZE = 6;

const checksumDriver: ChecksumDriver = new IPv4Checksum();

export const ErrorChecksum = new Error("Checksum verification failed");
export const ErrorDecode = new Error("Too few bytes to decode");

export function convertRequestToBytes(request: Request): Uint8Array {
  return convertPayloadToBytes(Request.encode(request).finish());
}

export function convertResponseToBytes(response: Response): Uint8Array {
  return convertPayloadToBytes(Response.encode(response).finish());
}

export function convertPayloadToBytes(payload: Uint8Array): Uint8Array {
  const length = new Uint16Array([payload.length]);
  const checksum = new Uint16Array(
    checksumDriver.calculate(
      concatBytes([HEADER_START, length, payload], Uint8Array)
    )
  );
  return concatBytes([HEADER_START, length, checksum, payload], Uint8Array);
}

export function convertBytesToRequests(
  bytes: Uint8Array
): [Request[], Uint8Array] {
  const [payloads, remainder] = convertBytesToPayloads(bytes);
  return [payloads.map((payload) => Request.decode(payload)), remainder];
}

export function convertBytesToResponses(
  bytes: Uint8Array
): [Response[], Uint8Array] {
  const [payloads, remainder] = convertBytesToPayloads(bytes);
  return [payloads.map((payload) => Response.decode(payload)), remainder];
}

export function convertBytesToPayloads(
  bytes: Uint8Array
): [Uint8Array[], Uint8Array] {
  const payloads: Uint8Array[] = [];

  // Check all bytes
  while (bytes.length >= HEADER_SIZE) {
    // Get header
    const start = convertBytes(bytes.slice(0, 2), Uint16Array);
    const length = convertBytes(bytes.slice(2, 4), Uint16Array);
    const checksum = convertBytes(bytes.slice(4, 6), Uint16Array);

    // Check header
    if (start[0] != HEADER_START[0]) {
      bytes = bytes.slice(1);
      continue;
    }

    // Verify length
    if (length[0] + HEADER_SIZE < bytes.length) {
      break;
    }
    const packet = bytes.slice(0, length[0] + HEADER_SIZE);

    // // Verify checksum
    // if (!checksumDriver.verify(packet)) {
    //   bytes = bytes.slice(1);
    //   continue;
    // }

    // Add payload
    payloads.push(packet.slice(HEADER_SIZE));
    bytes = bytes.slice(packet.length);
  }

  // Extract payload
  return [payloads, bytes];
}
