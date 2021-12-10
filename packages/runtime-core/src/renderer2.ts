//vdom->element

//n1 oldVnode, n2 newVnode
export function diff(n1, n2) {
  //1.type
  if (n1.type !== n2.type) {
    //这里修改了
    console.log('这里不对');
    n1.el.replaceWith((n2.el = document.createElement(n2.type)));
  } else {
    n2.el = n1.el;
    //2.props
    //多了，少了，变了
    const { props: newProps } = n2;
    const { props: oldProps } = n1;

    //变了
    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        const oldVal = oldProps[key];
        if (newVal !== oldVal) {
          n1.el.setAttribute(key, newVal);
        }
      });
    }

    //少了
    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          n1.el.removeAttribute(key);
        }
      });
    }

    //多了
    if (newProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        if (!oldProps[key]) {
          n1.el.setAttribute(key, newVal);
        }
      });
    }

    //3.children
    const { children: oldChildren } = n1;
    const { children: newChildren } = n2;

    if (!Array.isArray(newChildren)) {
      if (!Array.isArray(oldChildren)) {
        if (oldChildren !== newChildren) {
          n1.el.innerText = newChildren;
        }
      } else {
        //新的是字符串，老的是数组
        n1.el.innerText = newChildren;
      }
    } else {
      if (!Array.isArray(oldChildren)) {
        //新的是数组，老的是字符串
        n1.el.innerText = ``;
        //这里修改了
        n2.children.forEach((v) => {
          mountElement(v, n1.el);
        });
      } else {
        const length = Math.min(newChildren.length, oldChildren.length);

        //变
        for (let index = 0; index < length; index++) {
          const newVnode = newChildren[index];
          const oldVnode = oldChildren[index];
          diff(oldVnode, newVnode);
        }

        //多
        if (newChildren.length > length) {
          for (let index = length; index < newChildren.length; index++) {
            const newVnode = newChildren[index];
            mountElement(newVnode, n1.el);
          }
        }

        //少
        if (oldChildren.length > length) {
          for (let index = length; index < oldChildren.length; index++) {
            const oldVnode = oldChildren[index];
            oldVnode.el.parentNode.removeChild(oldVnode.el);
          }
        }
      }
    }
  }
}

export function mountElement(vnode, container) {
  const { type, props, children } = vnode;

  //type
  const element = (vnode.el = document.createElement(type));

  //props
  if (props) {
    for (const key in props) {
      const val = props[key];
      element.setAttribute(key, val);
    }
  }

  //可以是string
  //可以是数组
  if (!Array.isArray(children)) {
    const textNode = document.createTextNode(children);
    element.append(textNode);
  } else {
    children.forEach((v) => {
      //递归

      mountElement(v, element);
    });
  }

  container.append(element);
}
