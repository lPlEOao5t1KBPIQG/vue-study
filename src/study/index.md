---
title:  umi 学习
tags:
  - umi
---

## 路由数据加载


## **Umi 会扫描你的页面文件，把导出的 `clientLoader` 自动注册到对应路由上**

---

### 1. 编译阶段扫描页面

* Umi 使用 **插件机制**和**约定式路由**或**配置式路由**：

  * 对于每个路由组件文件，Umi 会解析其中的导出（如 `clientLoader`、`loader`、`action` 等）。
  * 通过 AST（抽象语法树）或静态分析的方式提取出 `clientLoader` 函数。
* Umi 构建时会生成一个“路由配置对象”，里面已经包含了组件和 `clientLoader` 的引用。

---

### 2. 运行时匹配路由

* 当用户访问某个路径时，Umi 内部的路由系统（基于 `react-router`）会：

  * 根据路径找到当前匹配的路由链（可能有父子路由）。
  * 从“路由配置对象”中取出这些路由对应的 `clientLoader`。

---

### 3. 自动执行 `clientLoader`

* 对于每个匹配到的路由：

  * 如果存在 `clientLoader`，会在组件渲染前执行它。
  * Umi 会在客户端收集这些数据，并缓存到上下文。
* 页面组件内部可以通过 `useClientLoaderData()` Hook 拿到数据。

---

### 代码示意（简化）

Umi 编译后的效果类似于：

```ts
// 构建阶段生成的路由配置
import IndexPage, { clientLoader as indexLoader } from '@/pages/index';
import SomePage, { clientLoader as someLoader } from '@/pages/SomePage';

export const routes = [
  { path: '/', element: <IndexPage />, clientLoader: indexLoader },
  { path: '/some', element: <SomePage />, clientLoader: someLoader },
];
```

然后运行时执行逻辑：

```ts
async function handleRouteChange(path: string) {
  const matched = matchRoutes(routes, path);
  const loaders = matched
    .map(r => r.route.clientLoader)
    .filter(Boolean);

  const results = await Promise.all(loaders.map(fn => fn()));
  // 注入到 context
}
```

所以你在代码里看到的是：

```tsx
const { data } = useClientLoaderData();
```

但这个 `data` 是 Umi 预先帮你在编译和运行时两步完成的数据收集和注入。

---

## 模拟实现

### 1. 全局 Context 管理数据

```tsx
// loaderContext.tsx
import React, { createContext, useContext, useState } from 'react';

type LoaderDataContextType = {
  dataMap: Record<string, any>;
  setData: (path: string, data: any) => void;
};

const LoaderDataContext = createContext<LoaderDataContextType>({
  dataMap: {},
  setData: () => {},
});

export function LoaderDataProvider({ children }: { children: React.ReactNode }) {
  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  const setData = (path: string, data: any) => {
    setDataMap(prev => ({ ...prev, [path]: data }));
  };

  return (
    <LoaderDataContext.Provider value={{ dataMap, setData }}>
      {children}
    </LoaderDataContext.Provider>
  );
}

export function useLoaderContext() {
  return useContext(LoaderDataContext);
}
```

---

### 2. 路由变化时调用所有匹配的 `clientLoader`

```tsx
// routeLoader.ts
import { useLoaderContext } from './loaderContext';

type Route = {
  route: string;
  clientLoader?: () => Promise<any>;
};

export async function handleRouteChange(
  path: string,
  matchedRoutes: Route[],
  setData: (path: string, data: any) => void,
) {
  const results = await Promise.all(
    matchedRoutes.map(r => (r.clientLoader ? r.clientLoader() : Promise.resolve(undefined))),
  );

  matchedRoutes.forEach((r, idx) => {
    setData(r.route, results[idx]);
  });
}
```

---

### 3. `useClientLoaderData` 自动获取当前路由数据

```tsx
// hooks.ts
import { useLocation } from 'react-router-dom';
import { useLoaderContext } from './loaderContext';

export function useClientLoaderData<T = any>() {
  const { pathname } = useLocation();
  const { dataMap } = useLoaderContext();
  return dataMap[pathname] as T;
}
```

---

### 4. 页面示例

```tsx
// pages/SomePage.tsx
import React from 'react';
import { useClientLoaderData } from '../hooks';

export default function SomePage() {
  const data = useClientLoaderData<string>();
  return <div>{data}</div>;
}

export async function clientLoader() {
  const res = await fetch('/api/data');
  return res.text();
}
```

---

### 5. 在应用中使用

```tsx
// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LoaderDataProvider, useLoaderContext } from './loaderContext';
import { handleRouteChange } from './routeLoader';
import SomePage, { clientLoader as pageBLoader } from './pages/SomePage';

const routes = [
  { route: '/', clientLoader: async () => 'Home data' },
  { route: '/pageB', clientLoader: pageBLoader },
];

function RouteWatcher() {
  const location = useLocation();
  const { setData } = useLoaderContext();

  useEffect(() => {
    const matched = routes.filter(r => location.pathname.startsWith(r.route));
    handleRouteChange(location.pathname, matched, setData);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <LoaderDataProvider>
      <BrowserRouter>
        <RouteWatcher />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/pageB" element={<SomePage />} />
        </Routes>
      </BrowserRouter>
    </LoaderDataProvider>
  );
}
```

---

### 运行效果

1. **页面切换到 `/pageB`** 时，`RouteWatcher` 会触发 `handleRouteChange`。
2. 所有匹配的路由（`/` 和 `/pageB`）的 `clientLoader` 会被并行执行。
3. 数据被存到全局 Context。
4. 页面里的 `useClientLoaderData()` 自动获取当前路径的数据。

---

**优点：**

* 简单易懂，和 Umi 的机制相似。
* 可以很容易扩展，比如在路由表里加鉴权、错误处理等。
* 页面代码干净，只需 `useClientLoaderData()`。

---



