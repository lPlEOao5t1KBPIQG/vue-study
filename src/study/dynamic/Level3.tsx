import withLoader, { useAllLoaderData } from './withLoader';

async function fetchLevel3Data() {
  await new Promise((r) => setTimeout(r, 1000));
  return { level3Detail: '最终详情' };
}

function Level3View() {
  const data = useAllLoaderData();
  return <div>所有数据：{JSON.stringify(data)}</div>;
}

export default withLoader({ loader: fetchLevel3Data });
