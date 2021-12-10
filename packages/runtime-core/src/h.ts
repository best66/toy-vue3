import { createVNode } from './vnode';

/**
 * 创建虚拟dom
 * @param type
 * @param props
 * @param children
 * @returns
 */
export const h = (type: string, props: any, children: string | Array<any>) => {
  //console.log(createVNode(type, props, children));
  return createVNode(type, props, children);
};
