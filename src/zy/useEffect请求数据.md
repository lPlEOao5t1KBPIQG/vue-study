---
title: 使用Effect请求数据
tags:
   - react
---




在现代前端开发中，**客户端缓存**是提升应用性能和用户体验的重要策略。通过在客户端存储和管理数据，可以减少不必要的网络请求，加快页面加载速度，并优化整体性能。本文将详细探讨使用客户端缓存的优势，以及如何在项目中利用流行的开源解决方案（如 React Query、SWR、React Router v6.4+）或自定义方案来实现高效的数据管理。

---

## 客户端缓存的优势

1. **减少重复请求**：通过缓存已获取的数据，避免在短时间内对同一资源发起多次网络请求，从而降低服务器负载，提高应用响应速度。

2. **提升用户体验**：缓存数据使页面在用户导航时能够即时显示内容，减少加载等待时间，提供更流畅的交互体验。

3. **避免网络瀑布效应**：通过预加载数据或将数据需求提升到路由级别，可以避免组件层级过深导致的级联数据请求，优化渲染性能。

---

## 开源解决方案及其在项目中的应用

### 1. React Query

**简介**：

React Query 是一个用于管理服务器状态的库，提供数据获取、缓存、同步和更新等功能，简化了 React 应用中的数据管理。

**主要特性**：

- **自动缓存和后台同步**：自动缓存数据，并在后台同步更新，确保数据新鲜。

- **查询失效和重新获取**：支持手动或基于时间的查询失效，自动重新获取数据。

- **简单易用的 API**：提供 `useQuery`、`useMutation` 等 Hook，方便在组件中进行数据操作。

**在项目中的使用**：

1. **安装 React Query**：

   ```bash
   npm install @tanstack/react-query
   ```
   citeturn0search6

2. **设置 QueryClient**：

   在应用的入口文件中，创建并提供 `QueryClient`：

   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import App from './App';

   const queryClient = new QueryClient();

   ReactDOM.render(
     <QueryClientProvider client={queryClient}>
       <App />
     </QueryClientProvider>,
     document.getElementById('root')
   );
   ```
   citeturn0search6

3. **在组件中使用 `useQuery`**：

   在需要获取数据的组件中，使用 `useQuery` Hook：

   ```jsx
   import { useQuery } from '@tanstack/react-query';
   import axios from 'axios';

   const fetchTodos = async () => {
     const { data } = await axios.get('/api/todos');
     return data;
   };

   function Todos() {
     const { data, error, isLoading } = useQuery(['todos'], fetchTodos);

     if (isLoading) return <p>加载中...</p>;
     if (error) return <p>加载错误: {error.message}</p>;

     return (
       <ul>
         {data.map(todo => (
           <li key={todo.id}>{todo.title}</li>
         ))}
       </ul>
     );
   }
   ```
   citeturn0search6

**注意事项**：

- React Query 默认将缓存存储在内存中，页面刷新或关闭后会丢失。如果需要持久化缓存，可以使用 `persistQueryClient` 插件，将缓存同步到本地存储（如 `localStorage`）。

---

### 2. SWR

**简介**：

SWR（Stale-While-Revalidate）是由 Vercel 开发的 React Hooks 库，用于数据获取，具有自动缓存、实时同步、回退等特性。

**主要特性**：

- **自动缓存和实时同步**：数据在获取后会被缓存，并在重新获取时保持同步。

- **焦点追踪和重新验证**：当窗口获得焦点或重新连接网络时，自动重新验证数据。

- **支持本地和全局状态**：可以在组件级别或全局范围内共享数据状态。

**在项目中的使用**：

1. **安装 SWR**：

   ```bash
   npm install swr
   ```
   citeturn0search1

2. **在组件中使用 `useSWR`**：

   在需要获取数据的组件中，使用 `useSWR` Hook：

   ```jsx
   import useSWR from 'swr';

   const fetcher = (url) => fetch(url).then(res => res.json());

   function Profile() {
     const { data, error, isLoading } = useSWR('/api/user', fetcher);

     if (isLoading) return <p>加载中...</p>;
     if (error) return <p>加载错误: {error.message}</p>;

     return (
       <div>
         <h1>{data.name}</h1>
         <p>{data.email}</p>
       </div>
     );
   }
   ```
   citeturn0search1

**注意事项**：

- SWR 默认将缓存存储在内存中，页面刷新或关闭后会丢失。但可以通过自定义缓存提供程序（如 `localStorage`）来持久化数据。

---

### 3. React Router v6.4+

在 React Router v6.4+ 中，引入了 `clientLoader` 和 `clientAction` 等功能，允许在客户端直接获取和修改数据，从而实现客户端缓存，减少重复请求，提升应用性能。 citeturn0search0

**主要概念**：

- **clientLoader**：在客户端获取数据的方法，适用于单页应用（SPA）模式。

- **clientAction**：在客户端提交或修改数据的方法。

**在项目中的使用**：

1. **定义 clientLoader**：

   在路由配置中，为特定路径定义 `clientLoader`，用于在客户端加载数据：

   ```jsx
   import { Route } from 'react-router-dom';

   async function clientLoader({ request }) {
     const response = await fetch('/api/data');
     const data = await response.json();
     return data;
   }

   <Route path="/example" element={<ExampleComponent />} clientLoader={clientLoader} />;
   ```


2. **在组件中使用加载的数据**：

   在组件中，通过 `useLoaderData` 钩子获取 `clientLoader` 加载的数据：

   ```jsx
   import { useLoaderData } from 'react-router-dom';

   function ExampleComponent() {
     const data = useLoaderData();

     return (
       <div>
         {/* 使用加载的数据 */}
       </div>
     );
   }
   ```


3. **定义 clientAction**：

   如果需要在客户端提交数据，可以定义 `clientAction`：

   ```jsx
   async function clientAction({ request }) {
     const formData = await request.formData();
     const response = await fetch('/api/submit', {
       method: 'POST',
       body: formData,
     });
     return response.json();
   }

   <Route path="/submit" element={<SubmitComponent />} clientAction={clientAction} />;
   ```


**注意事项**：

- 确保在适当的情况下使用 `clientLoader` 和 `clientAction`，以避免不必要的服务器请求。

- 结合错误边界和状态管理，处理可能出现的错误和加载状态。

通过在项目中使用 React Router v6.4+ 的这些功能，可以有效地实现客户端数据缓存，减少重复请求，提升应用的性能和用户体验。 citeturn0search0