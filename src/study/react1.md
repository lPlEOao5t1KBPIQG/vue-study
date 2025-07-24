`react-activation` 是一个在 React 中实现 **页面级缓存（KeepAlive）** 的库，其目标是让组件在离开视图时“保活”，避免卸载（卸载通常会销毁状态、DOM 等）。类似于 Vue 的 `<KeepAlive>` 组件。

---

## 🧠 核心实现原理一览

### ✅ 核心理念：

* **缓存组件实例及其 DOM 节点**
* 利用 `ReactDOM.createPortal` 保留卸载组件的 DOM 和状态
* 切换路由时通过**隐藏 DOM 而非卸载组件**来实现页面保活
* 内部维护一个**缓存池**，用来管理哪些组件缓存，哪些需要清除

---

## 🏗️ 大致实现流程：

### 1. 包裹组件入口：`<AliveScope>`

`<AliveScope>` 是所有缓存的上下文容器，底层用的是 React Context，内部维护了：

* 缓存 map（key => { component, domNode }）
* 激活/失活组件的控制器

```tsx
<AliveScope>
  <Router>
    <KeepAlive id="home">
      <Home />
    </KeepAlive>
  </Router>
</AliveScope>
```

---

### 2. 缓存机制实现：`<KeepAlive>`

* 每个 `<KeepAlive>` 会根据传入的 `id` 生成缓存 key
* 组件首次挂载时，会将其内容 **render 到独立的容器中（比如隐藏的 div）**
* 当组件被移出视图时，**不会卸载**，而是隐藏其 DOM
* 使用 `ReactDOM.createPortal` 把组件渲染到 `AliveScope` 管理的缓存容器中

> 这样做避免了 React 的卸载逻辑，从而达到“保活”的目的。

---

### 3. DOM 隐藏/展示逻辑

* 当前激活的组件会被 `display: block`
* 非当前页面的缓存组件则通过 `display: none` 隐藏 DOM，但状态/副作用还在

```js
const hiddenStyle = {
  display: 'none',
};
```

---

### 4. 卸载机制（可配置）

当缓存池满了，或你主动调用 `drop` 删除缓存，`react-activation` 会：

* 从缓存池中移除该组件
* 卸载其 React 实例和 DOM
* 触发真正的组件 `unmount`

---

## 🧩 与普通 React 区别

| 普通 React 路由切换 | `react-activation` 切换 |
| ------------- | --------------------- |
| 组件卸载+重新挂载     | 组件隐藏+保留实例             |
| DOM 被销毁       | DOM 被缓存+隐藏            |
| 状态丢失          | 状态保留                  |

---

## 🛠️ 简化版原理示意代码（伪代码）

```tsx
const cacheMap = new Map();

function KeepAlive({ children, id }) {
  const container = document.createElement('div');

  useEffect(() => {
    if (!cacheMap.has(id)) {
      ReactDOM.render(children, container);
      cacheMap.set(id, container);
    }
    return () => {
      // 不卸载，只隐藏
      container.style.display = 'none';
    };
  }, []);

  return createPortal(cacheMap.get(id), document.body);
}
```

当然，真正的实现还包含了：

* 缓存 key 管理
* 多页面切换优先级
* 缓存上限 / 回收策略
* 页面重用时如何重绑定副作用

---

## 📦 react-activation 的优势

* ✅ 支持 React Router、Umi、SPA 项目
* ✅ 可配置缓存 id、激活/失活钩子
* ✅ 支持最大缓存数、手动 drop 缓存

---

## 🔗 官方文档

GitHub: [https://github.com/CJY0208/react-activation](https://github.com/CJY0208/react-activation)

---

如果你希望自己实现一个简单的 KeepAlive 组件用于特定场景（比如多 Tab 页保活），我可以根据你的需求写一个精简版本。是否需要？
