// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useUmiRoutesBundle, AccessProvider } from './RouterRenderer';
// 你的 getRoutes 与 configRoutes
import { getRoutes } from './umiRoutes';
import configRoutes from '../../../config/routes'; // export default [...] 那个

function RoutesHost({ bundle }: { bundle: { routes: any; routeComponents: any } }) {
  // 必须在组件内部调用 useUmiRoutesBundle（Hook 规则）
  const element = useUmiRoutesBundle(bundle);
  return element;
}

export default function App() {
  const [bundle, setBundle] = React.useState<{ routes: any; routeComponents: any } | null>(null);

  React.useEffect(() => {
    (async () => {
      const b = await getRoutes(configRoutes);
      setBundle(b);
    })();
  }, []);

  if (!bundle) return null;

  return (
    <AccessProvider value={{ canAdmin: true /* 这里可接你实际的权限表 */ }}>
      <BrowserRouter>
        <RoutesHost bundle={bundle} />
      </BrowserRouter>
    </AccessProvider>
  );
}
