import { ORIGINS } from '../config';

export function isOriginValid(originToCheck: string) {
  return ORIGINS.some(origin => {
    if (typeof origin === 'string') {
      return origin === originToCheck;
    }
    return origin.test(originToCheck)
  });
}
