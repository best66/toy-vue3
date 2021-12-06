import { effect } from '@toy-vue/reactivity';
import { diff, mountElement } from '@toy-vue/runtime-core';

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      let isMounted = false;
      let preVirtualDOM;

      effect(() => {
        if (!isMounted) {
          //init
          rootContainer.innerHTML = '';
          const virtualDOM = rootComponent.render(context);
          mountElement(virtualDOM, rootContainer);
          preVirtualDOM = virtualDOM;
          isMounted = true;
        } else {
          //update
          const virtualDOM = rootComponent.render(context);
          diff(preVirtualDOM, virtualDOM);
          preVirtualDOM = virtualDOM;
        }
      });
    }
  };
}
