const url = 'http://admin:pass@localhost:8984/test';
const rpn = require('request-promise-native');
const fs = require('fs');

const docs = require('./docs.json');

const seqs = [];
let since;

const pushBatch = async () => {
  const batch = docs.splice(0, 100);
  await rpn.post({ url: `${url}/_bulk_docs`, json: true, body: { docs: batch } });
  const changes = await rpn.get({ url: `${url}/_changes`, qs: { since }, json: true });
  since = changes.last_seq;
  seqs.push(since);
};

(async () => {
  const info = await rpn.get({ url: `${url}`, json: true });
  seqs.push(info.update_seq);
  since = info.update_seq;
  while (docs.length) {
    await pushBatch();
  }

  fs.writeFileSync('./seqs.json', JSON.stringify(seqs, null, 2));
})();

