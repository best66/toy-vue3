import { isOn } from '@toy-vue/shared';
import { createRenderer } from '@toy-vue/runtime-core';

function createElement(type) {
  const element = document.createElement(type);
  return element;
}

function createText(text) {
  return document.createTextNode(text);
}

function setText(node, text) {
  node.nodeValue = text;
}

function setElementText(el, text) {
  el.textContent = text;
}

function patchProp(el, key, preValue, nextValue) {
  if (isOn(key)) {
    //事件处理器，全部加到el的_vei属性上
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key]; // eg. key = onClick

    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = (invokers[key] = nextValue);
        el.addEventListener(eventName, invoker);
      } else {
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
    if (nextValue === null || nextValue === '') {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

//函数式insert
function insert(child, parent, anchor = null) {
  if (anchor) {
    parent.insertBefore(child, anchor);
  } else {
    parent.appendChild(child);
  }
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

let renderer;

/**
 * 返回renderer
 * @returns
 */
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer({
      createElement,
      createText,
      setText,
      setElementText,
      patchProp,
      insert,
      remove
    }))
  );
}

export const createApp = (...args) => {
  // renderer.createApp
  return ensureRenderer().createApp(...args);
};
