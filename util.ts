import { merge } from 'webpack-merge';

const x = {
  a: [1],
};
const y = {
  a: [2],
};

console.log(merge(x, y));
