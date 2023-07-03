const url = 'http://admin:pass@localhost:8984/test';
const rpn = require('request-promise-native');
const { expect } = require('chai');
const _ = require('lodash');
const identical = process.argv[2] === 'true';

const savedSeqs = require('./seqs.json');
const docs = require('./docs.json');
const BATCH_LENGTH = 100;

let since;

const pushBatch = async () => {
  const batch = _.shuffle(docs.splice(0, BATCH_LENGTH));
  await rpn.post({ url: `${url}/_bulk_docs`, json: true, body: { docs: batch } });

  const oldSeq = savedSeqs.shift();
  if (identical) {
    expect(oldSeq).to.equal(since);
  }

  const changes = await rpn.get({ url: `${url}/_changes`, qs: { since: oldSeq }, json: true });
  if (identical) {
    expect(changes.results.length).to.equal(batch.length);
  } else {
    // some amount of changes are received.
    expect(changes.results.length).to.be.greaterThan(BATCH_LENGTH * 0.5);
    expect(changes.results.length).to.be.lessThan(BATCH_LENGTH * 2.5);
  }

  const changesNewSeq = await rpn.get({ url: `${url}/_changes`, qs: { since: since }, json: true });
  since = changesNewSeq.last_seq;
  expect(changesNewSeq.results.length).to.equal(BATCH_LENGTH);
};

(async () => {
  const info = await rpn.get({ url: `${url}`, json: true });
  since = info.update_seq;
  while (docs.length) {
    await pushBatch();
  }
})();
