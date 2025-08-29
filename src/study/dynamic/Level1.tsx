import withLoader from './withLoader';

async function fetchLevel1Data() {
  await new Promise((r) => setTimeout(r, 1000));
  return { level1User: 'Tom', token: '123' };
}

export default withLoader({ loader: fetchLevel1Data });
