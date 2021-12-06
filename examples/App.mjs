import { reactive, h } from '/node_modules/toy-vue/dist/toy-vue.esm-bundler.js';

export const App = {
  // template 会编译成 render 函数
  render(context) {
    //构建视图
    // 要计算出最小的更新点，diff算法
    let ret;
    if (context.state.count == 1) {
      ret = h('div', { class: `class${context.state.count}` }, [
        h('p', null, '123'),
        h('div', null, context.state.count),
        h('p', null, context.state.count)
      ]);
    } else {
      ret = h('div', { class: `class${context.state.count}` }, [
        h('p', null, '123'),
        h('p', null, context.state.count),
        h('p', null, context.state.count)
      ]);
    }

    return ret;
  },
  setup() {
    const state = reactive({
      count: 0
    });
    window.$state = state;
    return { state };
  }
};
