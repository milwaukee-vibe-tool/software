export default interface ChecksumDriver {
  calculate(bytes: Uint8Array): Uint16Array;
  verify(bytes: Uint8Array, checksum?: Uint16Array): boolean;
}
