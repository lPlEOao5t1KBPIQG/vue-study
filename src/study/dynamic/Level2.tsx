import withLoader, { useAllLoaderData } from './withLoader';

async function fetchLevel2Data() {
  await new Promise((r) => setTimeout(r, 1000));
  return { level2List: [1, 2, 3] };
}

function Level2View() {
  const data = useAllLoaderData();
  return <div>所有数据：{JSON.stringify(data)}</div>;
}

export default withLoader({ loader: fetchLevel2Data });
