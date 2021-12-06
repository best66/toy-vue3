export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) effect();
}

// 用栈解决嵌套 effect 问题
const effectStack = [];

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    console.log(1);
  };
  return effect;
}
