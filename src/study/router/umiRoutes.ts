import React from 'react';
import routes from '../../../config/routes'
export interface RouteConfig {
  path: string;
  component?: string;
  routes?: RouteConfig[];
  redirect?: string;
  layout?: boolean;
  access?: string;
  name?: string;
  icon?: string;
}

interface RouteMap {
  [id: string]: RouteConfig & { id: string; parentId?: string };
}

interface RouteComponentsMap {
  [id: string]: React.LazyExoticComponent<React.ComponentType<any>>;
}

// 占位组件
const EmptyRoute = React.lazy(() => import('./EmptyRoute'));

// 模拟插件 hook
function applyPluginHook(route: RouteMap[string]): RouteMap[string] {
  // 可以在这里处理 plugin-layout / plugin-access 等逻辑
  return route;
}

// 递归生成 routes map 和 routeComponents map
let idCounter = 0;
function normalizeRoutes(
  routes: RouteConfig[],
  parentId?: string
): { routesMap: RouteMap; routeComponents: RouteComponentsMap } {
  const routesMap: RouteMap = {};
  const routeComponents: RouteComponentsMap = {};

  for (const route of routes) {
    const id = String(idCounter++);
    const normalized = applyPluginHook({ ...route, id, parentId });

    console.log('Normalized Route:', normalized); // 调试输出

    routesMap[id] = normalized;

    // 处理 component
    if (normalized.component) {
      // 模拟 webpackChunkName 注释
      const chunkName = normalized.path
        .replace(/\//g, '__')
        .replace(/^__/, '');
      routeComponents[id] = React.lazy(() =>
        import(
          /* webpackChunkName: `"p__${chunkName}"` */ `${normalized.component}`
        )
      );
    } else {
      // 没有 component 的路由用占位组件
      routeComponents[id] = EmptyRoute;
    }

    // 递归处理子路由
    if (normalized.routes) {
      const childMaps = normalizeRoutes(normalized.routes, id);
      Object.assign(routesMap, childMaps.routesMap);
      Object.assign(routeComponents, childMaps.routeComponents);
    }
  }

  return { routesMap, routeComponents };
}

// 核心 getRoutes() 函数
export async function getRoutes(configRoutes: RouteConfig[]) {
  console.log('Config Routes:', configRoutes); // 调试输出
  const { routesMap, routeComponents } = normalizeRoutes(configRoutes);

  console.log('Normalized Routes Map:', routesMap);
  console.log('Route Components Map:', routeComponents);
  return { routes: routesMap, routeComponents };
}

getRoutes(routes)

