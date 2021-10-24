const cjs = require('./index.cjs');

let res = 0;
console.time('cjs');
for (let i = 0; i < 100000; i++) {
  res = cjs('1.0.0', '2.0.0');
}
console.timeEnd('cjs');
console.log('fin', res);
