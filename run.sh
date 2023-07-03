#!/bin/bash

set -e

runTest() {
  IDENTICAL_DOCS=$1
  docker-compose down --remove-orphans --volumes && sudo rm -rf ./srv/ && sudo rm -rf ./srv-bk/
  docker-compose up -d
  sleep 10 # wait for couch to be up
  node ./prep-db.js
  cp -r ./srv ./srv-bk
  node ./generate-docs.js "$IDENTICAL_DOCS"
  node ./push-docs-batch.js "$IDENTICAL_DOCS"
  docker-compose down
  COUCHDB_DATA=./srv-bk docker-compose up -d
  sleep 10 # wait for couch to be up
  node ./push-docs-batch-compare.js "$IDENTICAL_DOCS"
}

runTest true
runTest false
