// https://stackoverflow.com/a/22114687/21507383
export function expand(src: ArrayBufferLike, newlength: number) {
  const dst = new ArrayBuffer(newlength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
}

// remove the 0 padding since we'll almost never be using the entire range of long long
export function compress(buffer: ArrayBufferLike) {
  buffer = expand(buffer, buffer.byteLength + 1); // pad zero
  const view = new DataView(buffer);
  let removal = 0;
  while (
    removal < buffer.byteLength &&
    !view.getInt8(buffer.byteLength - 1 - removal)
  )
    removal++;
  const newBuffer = buffer.slice(0, buffer.byteLength - removal + 1);
  new DataView(newBuffer).setInt8(newBuffer.byteLength - 1, 0xf0 | removal);
  return newBuffer;
}

export function decompress(buffer: ArrayBufferLike) {
  const view = new DataView(buffer);
  const extraBytes = view.getInt8(buffer.byteLength - 1) & 0xf;
  const newBuffer = expand(
    buffer.slice(0, -1),
    buffer.byteLength - 2 + extraBytes,
  );
  return newBuffer;
}

export function append(
  bufferPrefix: ArrayBufferLike,
  bufferSuffix: ArrayBufferLike,
) {
  const combinedBuffer = new ArrayBuffer(
    bufferPrefix.byteLength + bufferSuffix.byteLength,
  );
  const pview = new DataView(bufferPrefix);
  const sview = new DataView(bufferSuffix);
  const a = new Uint8Array(combinedBuffer);
  for (let i = 0; i < bufferPrefix.byteLength; i++) a[i] = pview.getInt8(i);
  for (let i = 0; i < bufferSuffix.byteLength; i++)
    a[i + bufferPrefix.byteLength] = sview.getInt8(i);
  return combinedBuffer;
}

export function extract_back(buffer: ArrayBufferLike, size: number): [ArrayBufferLike, DataView] {
  const remainingBuffer = buffer.slice(0, buffer.byteLength-size);
  const backBuffer = buffer.slice(buffer.byteLength-size);
  const view = new DataView(backBuffer);
  return [ remainingBuffer, view ];
}

export function printBuffer(buffer: ArrayBufferLike) {
  console.log(bufferHex(buffer));
}

export function bufferHex(buffer: ArrayBufferLike) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

export function abv(size: number): [ArrayBuffer, DataView] {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  return [buffer, view];
}