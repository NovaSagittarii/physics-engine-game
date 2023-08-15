import { test, describe, expect } from 'vitest';
import * as net from './networking';

function arrayBufferEquality(
  buffer1: ArrayBufferLike,
  buffer2: ArrayBufferLike,
) {
  expect(buffer1.byteLength, 'byte length').toBe(buffer2.byteLength);
  const view1 = new DataView(buffer1);
  const view2 = new DataView(buffer2);
  for (let i = 0; i < Math.min(buffer1.byteLength, buffer2.byteLength); i++) {
    expect(view1.getInt8(i), `byte ${i}`).toBe(view2.getInt8(i));
  }
}

function abv_single(size: number, location: number): [ArrayBuffer, DataView] {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  view.setInt8(location >> 2, 1 << location % 4);
  return [buffer, view];
}

function abv_random(size: number): [ArrayBuffer, DataView] {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  for (let i = 0; i < size; i++) view.setInt8(i, ~~(Math.random() * 256));
  return [buffer, view];
}

describe('compress', () => {
  test(`compress /0*10*/`, () => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setInt8(i, 1 << j);
        const compressedView = new DataView(net.compress(buffer));

        // check each byte is the same
        for (let i = 0; i < 8; i++) {
          if (view.getInt8(i) === 0) break;
          else expect(view.getInt8(i)).toBe(compressedView.getInt8(i));
          expect(view.byteLength + 1).toBeGreaterThanOrEqual(
            compressedView.byteLength,
          );
        }
      }
    }
  });
});

describe('decompress', () => {
  test(`compress & decompressing /0*10*/`, () => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setInt8(i, 1 << j);
        arrayBufferEquality(buffer, net.decompress(net.compress(buffer)));
      }
    }
  });
});

describe('append', () => {
  test(`two 8 bytes /0*10*/`, () => {
    for (let l = 0; l < 8; l++) {
      for (let r = 0; r < 8; r++) {
        const [buffer1, _view1] = abv_single(8, l * 4);
        const [buffer2, _view2] = abv_single(8, r * 4);
        const combined = net.append(buffer1, buffer2);
        arrayBufferEquality(buffer1, combined.slice(0, 8));
        arrayBufferEquality(buffer2, combined.slice(8, 16));
      }
    }
  });
  test(`variable bytes /([01]{8}){0-8}/`, () => {
    for (let l = 0; l < 8; l++) {
      for (let r = 0; r < 8; r++) {
        const [buffer1, _view1] = abv_random(l);
        const [buffer2, _view2] = abv_random(r);
        const combined = net.append(buffer1, buffer2);
        arrayBufferEquality(buffer1, combined.slice(0, l));
        arrayBufferEquality(buffer2, combined.slice(l, 16));
        // net.printBuffer(combined);
      }
    }
  });
});
