import { isArray, isIntegerKey } from '@toy-vue/shared';

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) effect();
}

// 用栈解决嵌套 effect 问题
const effectStack = [];
let activeEffect;
let id = 0;

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    try {
      effectStack.push(fn);
      activeEffect = effect;
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  effect.id = id++;
  effect.__isEffect = true;
  effect.options = options;
  effect.deps = [];
  return effect;
}

//发布，订阅
const targetMap = new WeakMap();
function getDep(target, key) {
  let depsMap: Map<string, Set<Function>> = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  return dep;
}
export function track(target, type, key) {
  if (activeEffect == undefined) return; //什么都不用收集
  let dep = getDep(target, key);
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

export function trigger(target, type, key, newVal, oldValue?) {
  const depsMap: Map<string, Set<Function>> = targetMap.get(target);
  if (!depsMap) return;

  const execList: Set<Function> = new Set();
  const add = (dep: Set<Function>) => {
    if (dep) {
      dep.forEach((fn) => {
        execList.add(fn);
      });
    }
  };

  //数组特殊处理
  if (key === 'length' && isArray(target)) {
    //直接修改length的时候
    depsMap.forEach((dep, key) => {
      if (key > newVal || key === 'length') {
        add(dep);
      }
    });
  } else {
    add(depsMap.get(key));
    switch (type) {
      case 'add': //手动增加数组属性的时候，触发length的订阅
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length')); //
        }
    }
  }

  if (execList) {
    execList.forEach((fn) => {
      fn();
    });
  }
}
