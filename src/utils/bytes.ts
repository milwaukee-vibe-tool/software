type genericByteArray<T extends byteArrayTypes> = {
  new (
    buffer: ArrayBufferLike,
    byteOffset?: number | undefined,
    length?: number | undefined
  ): T;
  BYTES_PER_ELEMENT: number;
};

type byteArrayTypes =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array
  | Float32Array
  | Float64Array;

export function convertBytes<T extends byteArrayTypes>(
  bytes: byteArrayTypes,
  type: genericByteArray<T>
): T {
  // Create a padded byte array that fits the target data type
  const padded = new Uint8Array(
    Math.ceil(bytes.length / type.BYTES_PER_ELEMENT) * type.BYTES_PER_ELEMENT
  );
  // Copy given array to padded array
  padded.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
  // Convert byte array to target type
  return new type(padded.buffer, padded.byteOffset, padded.byteLength);
}

export function concatBytes<T extends byteArrayTypes>(
  list: byteArrayTypes[],
  type: genericByteArray<T>
): T {
  const byteLists = list.map((bytes) => convertBytes(bytes, Uint8Array));
  const allBytes = new Uint8Array(
    byteLists.reduce((length, bytes) => length + bytes.length, 0)
  );
  return convertBytes(allBytes, type);
}
