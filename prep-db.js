const url = 'http://admin:pass@localhost:8984/test';
const rpn = require('request-promise-native');
const { v4: uuid } = require('uuid');

(async () => {
  await rpn.put({ url, json: true });
  const docs = Array.from({ length: 200 }).map(() => ({ _id: uuid(), field: uuid() }));
  await rpn.post({ url: `${url}/_bulk_docs`, json: true, body: { docs } });
})();

