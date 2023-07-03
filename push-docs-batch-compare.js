const url = 'http://admin:pass@localhost:8984/test';
const rpn = require('request-promise-native');
const { expect } = require('chai');
const _ = require('lodash');

const savedSeqs = require('./seqs.json');
let since;
const docs = require('./docs.json');

const pushBatch = async () => {
  const batch = _.shuffle(docs.splice(0, 100));
  await rpn.post({ url: `${url}/_bulk_docs`, json: true, body: { docs: batch } });

  const oldSeq = savedSeqs.shift();
  expect(oldSeq).to.equal(since);
  const changes = await rpn.get({ url: `${url}/_changes`, qs: { since: oldSeq }, json: true });
  expect(changes.results.length).to.equal(batch.length);

  const changesNewSeq = await rpn.get({ url: `${url}/_changes`, qs: { since: since }, json: true });
  expect(changesNewSeq.results.length).to.equal(batch.length);
  since = changesNewSeq.last_seq;
};

(async () => {
  const info = await rpn.get({ url: `${url}`, json: true });
  since = info.update_seq;
  while (docs.length) {
    await pushBatch();
  }
})();
