export function calculateChecksum(bytes: Uint8Array): Uint16Array {
  const values = padBytes(bytes);
  // IPv4 checksum
  let sum = values.reduce((a, b) => a + b, 0);
  while (sum >= 0x10000) {
    sum = Math.floor(sum / 0x10000) + (sum % 0x10000);
  }
  const checksum = new Uint16Array([sum]);
  checksum[0] = ~checksum[0];
  return checksum;
}

export function verifyChecksum(
  bytes: Uint8Array,
  checksum: Uint16Array
): boolean {
  const withChecksum = new Uint8Array(bytes.length + 2);
  withChecksum.set(new Uint8Array(checksum.buffer, checksum.byteOffset, 2));
  withChecksum.set(bytes, 2);
  return calculateChecksum(withChecksum)[0] == 0;
}

function padBytes(raw: Uint8Array): Uint16Array {
  const padded = new Uint8Array(Math.ceil(raw.length / 2) * 2);
  padded.set(raw);
  return new Uint16Array(padded.buffer, padded.byteOffset, padded.length / 2);
}
