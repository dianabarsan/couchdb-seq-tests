const fs = require('fs');
const uuid = require('uuid').v4;
const identical = process.argv[2] === 'true';

const nbr = 10000;

const docs = Array.from({ length: nbr }).map(() => ({
  _id: identical ? uuid() : undefined,
  field: uuid(),
  field2: uuid(),
}));

fs.writeFileSync('./docs.json', JSON.stringify(docs, null, 2));
