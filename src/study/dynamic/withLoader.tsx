
// @ts-nocheck

import React, { useEffect, useState, createContext, useContext } from 'react';
import { Outlet } from 'umi';
import { Spin, Alert } from 'antd';

type LoaderFunction<T = any> = () => Promise<T>;

interface WithLoaderProps<T> {
  loader: LoaderFunction<T>;
  fallback?: React.ReactNode;
  errorFallback?: (error: any) => React.ReactNode;
}

interface LoaderContextValue {
  data: Record<string, any>; // 存储所有父级+本级数据
}

const LoaderContext = createContext<LoaderContextValue>({ data: {} });

export default function withLoader<T>({
  loader,
  fallback,
  errorFallback,
}: WithLoaderProps<T>) {
  return function LoaderWrapper() {
    const parent = useContext(LoaderContext); // 获取父层的数据
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Record<string, any>>({});
    const [error, setError] = useState<any>(null);

    useEffect(() => {
      let mounted = true;

      async function run() {
        try {
          const result = await loader();
          if (mounted) {
            // 合并父层和本层的数据
            setData({ ...parent.data, ...result });
          }
        } catch (err) {
          if (mounted) setError(err);
        } finally {
          if (mounted) setLoading(false);
        }
      }

      run();
      return () => {
        mounted = false;
      };
    }, []);

    if (loading) return <>{fallback || <Spin tip="加载中..." />}</>;

    if (error) {
      return (
        <>
          {errorFallback ? (
            errorFallback(error)
          ) : (
            <Alert message="加载出错" description={String(error)} type="error" />
          )}
        </>
      );
    }

    return (
      <LoaderContext.Provider value={{ data }}>
        <Outlet />
      </LoaderContext.Provider>
    );
  };
}

/**
 * Hook：子组件可以拿到所有父层+本层的数据
 */
export function useAllLoaderData<T = Record<string, any>>(): T {
  const ctx = useContext(LoaderContext);
  return ctx.data as T;
}
