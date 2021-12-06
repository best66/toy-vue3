import { isObject } from '@toy-vue/shared';
import {
  reactiveHandler,
  shallowReactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler
} from './baseHandler';

export function reactive(target) {
  return createReactiveObject(target, false, reactiveHandler);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandler);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandler);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandler);
}

/**
 *
 * @param target 创建代理的目标
 * @param isReadonly 是否只读
 * @param baseHandler 针对不同的方式创建不同的代理对象
 */
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function createReactiveObject(target, isReadonly: boolean = false, baseHandler) {
  if (!isObject(target)) return target;

  const proxyMap = isReadonly ? readonlyMap : reactiveMap;

  const existProxy = proxyMap.get(target);
  if (existProxy) return existProxy;

  const proxy = new Proxy(target, baseHandler);
  proxyMap.set(target, proxy);

  return proxy;
}
