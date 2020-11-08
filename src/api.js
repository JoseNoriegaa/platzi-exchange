const PROTOCOL = 'https';
const HOST = 'api.coincap.io';
const PATH = 'v2';

const baseURL = `${PROTOCOL}://${HOST}/${PATH}`;

const getAssets = () => fetch(`${baseURL}/assets?limit=20`)
  .then((res) => res.json())
  .then((res) => res.data);

const getAsset = (coin) => fetch(`${baseURL}/assets/${coin}`)
  .then((res) => res.json())
  .then((res) => res.data);

const getAssetHistory = (coin) => {
  const now = new Date();
  const end = now.getTime();
  now.setDate(now.getDate() - 1);
  const start = now.getTime();

  return fetch(`${baseURL}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

const getMarkets = (coin) => fetch(`${baseURL}/assets/${coin}/markets?limit=5`)
  .then((res) => res.json())
  .then((res) => res.data);

const getExchange = (id) => fetch(`${baseURL}/exchanges/${id}`)
  .then((res) => res.json())
  .then((res) => res.data);

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange,
};
