import { extend, isObject, hasChanged, isArray, isIntegerKey, hasOwn } from '@toy-vue/shared';
import { reactive, readonly } from './reactive';

function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      //console.log('收集依赖');
    }
    if (isObject(res) && !shallow) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}

//针对数组而言，如果调用push方法，会触发两次set
//第一次新增一项，第二次设置length
function createSetter(shallow: boolean = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];

    let hadKey: boolean =
      isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);

    const res = Reflect.set(target, key, value, receiver);

    if (!hadKey) {
      //console.log('新增', key);
    } else if (hasChanged(oldValue, value)) {
      //console.log(oldValue, value, '修改');
    }

    return res;
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
