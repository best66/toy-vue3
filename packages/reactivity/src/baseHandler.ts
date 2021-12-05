import { extend, isObject } from '@toy-vue/shared';
import { reactive, readonly } from './reactive';

function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      console.log('更新视图');
    }
    if (isObject(res) && !shallow) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter(shallow: boolean = false) {
  return function set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  };
}

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);

export const reactiveHandler = {
  get: get,
  set: set
};
export const shallowReactiveHandler = {
  get: shallowGet,
  set: shallowSet
};
let readonlySet = {
  set(target, key) {
    console.warn(`can't set ${key} on readonly target ${target}`);
    return true;
  }
};
export const readonlyHandler = extend(
  {
    get: readonlyGet
  },
  readonlySet
);
export const shallowReadonlyHandler = extend(
  {
    get: shallowReadonlyGet
  },
  readonlySet
);
