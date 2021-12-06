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
