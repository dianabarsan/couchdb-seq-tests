### CouchDb sequence comparison when pushing docs again after restoring from backup

```
npm ci
./run.sh
```

Requires sudo to delete docker-owned folders.

### Results:

When pushing identical docs - in same "batches" but different order of docs in batch, seq-s end up identical.
When pushing non-identical docs - docs that have same properties but are missing _id fields, seqs are not identical, but requesting changes with old seqs is possible, yielding some amount of docs.

In either case, couchdb _changes accepts seqs that were generated using an old data set.
