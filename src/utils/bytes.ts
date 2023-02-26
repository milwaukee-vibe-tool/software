type genericByteArray<T extends ByteArrayType> = {
  new (
    buffer: ArrayBufferLike,
    byteOffset?: number | undefined,
    length?: number | undefined
  ): T;
  BYTES_PER_ELEMENT: number;
};

type ByteArrayType =
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

export function convertBytes<T extends ByteArrayType>(
  bytes: ByteArrayType,
  type: genericByteArray<T>
): T {
  // Create a padded byte array that fits the target data type
  const padded = new Uint8Array(
    Math.ceil(bytes.length / type.BYTES_PER_ELEMENT) *
      type.BYTES_PER_ELEMENT *
      bytes.BYTES_PER_ELEMENT
  );
  // Copy given array to padded array
  padded.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
  // Convert byte array to target type
  return new type(
    padded.buffer,
    padded.byteOffset,
    padded.byteLength / type.BYTES_PER_ELEMENT
  );
}

export function concatBytes<T extends ByteArrayType>(
  list: ByteArrayType[],
  type: genericByteArray<T>
): T {
  return convertBytes(
    new Uint8Array(
      list.flatMap((bytes) => Array.from(convertBytes(bytes, Uint8Array)))
    ),
    type
  );
}
