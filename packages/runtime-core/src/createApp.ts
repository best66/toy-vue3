import { createVNode } from './vnode';

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        //基于 vnode 进行开箱
        //将vnode渲染成vdom，并挂载到根组件
        render(vnode, rootContainer);
      }
    };

    return app;
  };
}
