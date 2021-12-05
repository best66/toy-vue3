Vue 使用了 RFC


Vue 2 的问题：
defineProperty 有性能问题，且有缺陷


Vue 3 优化：
编译时生成了 Block Tree，可以对动态节点进行收集，生成一个数组（动态节点扁平化了）
patchFlag 标记动态节点
使用 jsx 没法对编译进行优化

