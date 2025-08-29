import React, { createContext, useContext } from 'react';

// —— Access 上下文，模拟 plugin-access（你也可以换成自己的实现）——
const AccessContext = React.createContext<Record<string, boolean>>({});
export const AccessProvider: React.FC<{ value: Record<string, boolean>; children: React.ReactNode }> = ({ value, children }) => (
  <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
);
export function AccessBoundary({ accessKey, children }: { accessKey?: string; children: React.ReactNode }) {
  const access = React.useContext(AccessContext);
  if (accessKey && !access?.[accessKey]) return <div>403</div>;
  return <>{children}</>;
}
