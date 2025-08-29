// RouterRenderer.tsx
import React, { Suspense } from 'react';
import { useRoutes, Navigate, type RouteObject } from 'react-router-dom';

// —— 类型（按你的 getRoutes 返回结构改名即可）——
type RouteInMap = {
  id: string;
  path?: string;            // 例如 /admin/sub-page 或 ./*
  parentId?: string;
  redirect?: string;
  access?: string;          // canAdmin 等
  layout?: boolean;         // false 表示不套全局布局（通常已由 parentId 关系体现）
  isLayout?: boolean;       // 例如 ant-design-pro-layout
  name?: string;
  icon?: string;
};
type RoutesMap = Record<string, RouteInMap>;
type RouteComponents = Record<string, React.LazyExoticComponent<React.ComponentType<any>>>;

// —— Access 上下文，模拟 plugin-access（你也可以换成自己的实现）——
const AccessContext = React.createContext<Record<string, boolean>>({});
export const AccessProvider: React.FC<{ value: Record<string, boolean>; children: React.ReactNode }> = ({ value, children }) => (
  <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
);
function AccessBoundary({ accessKey, children }: { accessKey?: string; children: React.ReactNode }) {
  const access = React.useContext(AccessContext);
  if (accessKey && !access?.[accessKey]) return <div>403</div>;
  return <>{children}</>;
}

// —— 1. 把扁平 map 组装成树 —— 
type Node = RouteInMap & { children: Node[] };
function buildTree(map: RoutesMap): Node[] {
  const nodes: Record<string, Node> = {};
  const roots: Node[] = [];
  Object.values(map).forEach((r) => (nodes[r.id] = { ...r, children: [] }));
  Object.values(nodes).forEach((n) => {
    if (n.parentId && nodes[n.parentId]) nodes[n.parentId].children.push(n);
    else roots.push(n);
  });

  console.log('Built Route Tree:',roots);
  return roots;
}

// —— 2. 计算相对 path（让子路由在 v6 下更自然）—— 
function relativePath(parentPath?: string, childPath?: string) {
  if (!childPath) return undefined;
  if (childPath === './*' || childPath === '*') return '*';
  if (!parentPath || parentPath === '/') return childPath.replace(/^\//, '');
  if (childPath === parentPath) return '';                // index 路由
  if (childPath.startsWith(parentPath + '/')) return childPath.slice(parentPath.length + 1);
  return childPath.replace(/^\//, '');
}

// —— 3. Node -> RouteObject（递归）——
function nodeToRouteObject(node: Node, map: RoutesMap, comps: RouteComponents, parentPath?: string): RouteObject {
  const LazyComp = comps[node.id];
  let element: React.ReactElement;

  if (node.redirect) {
    element = <Navigate to={node.redirect} replace />;
  } else if (LazyComp) {
    element = <LazyComp /> as any; // 你的 getRoutes 已经返回 React.lazy 组件
  } else {
    // 没组件就给个空壳，通常你的 map 已经放了 EmptyRoute
    element = <React.Fragment />;
  }

  // access 包裹（模拟 plugin-access）
  element = <AccessBoundary accessKey={node.access}>{element}</AccessBoundary>;

  // 所有懒组件统一用 Suspense 包一下
  element = <Suspense fallback={null}>{element}</Suspense>;

  // 子路由
  const children = node.children.map((c) => nodeToRouteObject(c, map, comps, node.path));
  // 处理 path：根节点用绝对，子节点用相对
  let path = relativePath(parentPath, node.path);

  return { path, element, children: children.length ? children : undefined };
}

// —— 4. 导出一个 Hook：把 getRoutes 的结果转成 React Router Elements —— 
export function useUmiRoutesBundle(bundle: { routes: RoutesMap; routeComponents: RouteComponents }) {
  const { routes, routeComponents } = bundle;
  const tree = React.useMemo(() => buildTree(routes), [routes]);
  const routeObjects = React.useMemo(
    () => tree.map((n) => nodeToRouteObject(n, routes, routeComponents, undefined)),
    [tree, routes, routeComponents]
  );
  return useRoutes(routeObjects);
}
