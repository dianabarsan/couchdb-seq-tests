const fs = require('fs');
const uuid = require('uuid').v4;

const nbr = 10000;

const docs = Array.from({ length: nbr }).map(() => ({
  _id: uuid(),
  field: uuid(),
}));

fs.writeFileSync('./docs.json', JSON.stringify(docs, null, 2));
