//tag props child

//生成虚拟dom
export function h(tag, props, children) {
  return {
    tag,
    props,
    children
  };
}
