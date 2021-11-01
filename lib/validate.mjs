import { semver } from './compareVersions.mjs';

export const validate = (version) =>
  typeof version === 'string' && semver.test(version);
