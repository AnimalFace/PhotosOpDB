const fs = require('fs');
const faker = require('faker');

const writeFavorites = fs.createWriteStream('favorites.csv');
writeFavorites.write('userid,listing_id\n', 'utf8');

const getRandomInt = (min, max) => {
  return faker.random.number({
    min,
    max,
  });
}


const writeTenMillionFavorites = (writer, encoding, callback) => {
  let i = 1000000;
  let round = 0;

  const write = async () => {
    let ok = true;

    while (i > 0 && ok) {
      i -= 1;
      round += 1;

      if (i % 100000 === 0) {
        console.log(`${i} records to write`);
      }

//  for each user id, generate a random amount between 5 and 20 of random integers between 1 and 10000000 but not including integers already used by that user
  const alreadyLiked = [];
  const onlyReturnNewId = () => {
    const newId = getRandomInt(1, 5000000);
    if (alreadyLiked.includes(newId)) {
      return onlyReturnNewId()
   }
    alreadyLiked.push(newId);
    return newId
  }


for (let j = 0; j < (getRandomInt(5, 20)); j++) {
  const listing_id = onlyReturnNewId();
  const data = `${round},${listing_id}\n`;
  if (i === 0) {
    writer.write(data, encoding, callback);
  } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
    ok = writer.write(data, encoding);
  }
}
    }

    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  };
  write();
};

writeTenMillionFavorites(writeFavorites, 'utf-8', () => {
  writeFavorites.end();
});