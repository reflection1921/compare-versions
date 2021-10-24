import esm from './compare.js';

let res = 0;
console.time('esm');
for (let i = 0; i < 100000; i++) {
  res = esm('1.0.0', '2.0.0');
}
console.timeEnd('esm');
console.log('fin', res);
