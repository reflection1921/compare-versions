export default function compareVersions(v1, v2) {
  // validate input format
  [v1, v2].forEach(assertValidVersion);

  // trim input and drop metadata
  let [n1, p1] = dropPrefix(dropMeta(v1)).split('-');
  let [n2, p2] = dropPrefix(dropMeta(v2)).split('-');

  // ensure equal precision of number versions
  const l1 = lenOf(n1);
  const l2 = lenOf(n2);
  if (l1 < l2) {
    n1 = padDigits(n1, Math.max(l1, l2) - l1);
  } else if (l1 > l2) {
    n2 = padDigits(n2, Math.max(l1, l2) - l2);
  }

  // compare number versions
  const r = compareStrings(n1, n2);
  if (r !== 0) {
    return r;
  }

  // compare patch versions
  if (p1 && p2) {
    return compareStrings(p1, p2);
  } else if (p1 || p2) {
    return p1 ? -1 : 1;
  }

  return 0;
}

const semver =
  /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

const assertValidVersion = (version) => {
  if (typeof version !== 'string') {
    throw new TypeError('Invalid argument expected string');
  }
  if (!semver.test(version)) {
    throw new Error(
      `Invalid argument not valid semver ('${version}' received)`
    );
  }
};

const dropPrefix = (s) => (s.indexOf('v') === 0 ? s.substr(1) : s);
const dropMeta = (s) => s.replace(/\+.*$/, '');
const lenOf = (s) => (s.match(/\./g) || []).length - 1;
const padDigits = (s, n) => s.padEnd(s.length + n * 2, '.0');
const compareStrings = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true });

const operatorResMap = {
  '>': [1],
  '>=': [0, 1],
  '=': [0],
  '<=': [-1, 0],
  '<': [-1],
};

const allowedOperators = Object.keys(operatorResMap);

const validateOperator = (op) => {
  if (typeof op !== 'string') {
    throw new TypeError(
      `Invalid operator type, expected string but got ${typeof op}`
    );
  }
  if (allowedOperators.indexOf(op) === -1) {
    throw new TypeError(
      `Invalid operator, expected one of ${allowedOperators.join('|')}`
    );
  }
};

export const validate = (version) =>
  typeof version === 'string' && semver.test(version);

export const compare = (v1, v2, operator) => {
  // validate input operator
  validateOperator(operator);

  // since result of compareVersions can only be -1 or 0 or 1
  // a simple map can be used to replace switch
  const res = compareVersions(v1, v2);

  return operatorResMap[operator].includes(res);
};
