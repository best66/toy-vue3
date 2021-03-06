export * from './shapeFlags';

export function isObject(val): boolean {
  return typeof val == 'object' && val !== null;
}

export function hasChanged(oldValue, newValue): boolean {
  return oldValue !== newValue;
}

export let extend = Object.assign;

export let isArray = Array.isArray;

export function isIntegerKey(key): boolean {
  return parseInt(key) + '' == key;
}

export function hasOwn(target, key): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

// 必须是 on+一个大写字母的格式开头
export const isOn = (key) => /^on[A-Z]/.test(key);
