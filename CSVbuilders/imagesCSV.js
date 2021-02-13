const faker = require('faker');
const fs = require('fs');

const getRandomInt = (min, max) => {
    return faker.random.number({
      min,
      max,
    });
}

const getImageUrls = (num) => {
  // Set houseNum to num % number of house images available
  let houseNum = num % 21;
  if (houseNum === 0) {
    houseNum = 1;
  }
  const house = `https://homeimgs.s3-us-west-1.amazonaws.com/truliaHomes/${houseNum}.1.jpg`;

  return house;
};

const writeImages = fs.createWriteStream('images.csv');
writeImages.write('listing_id,img\n', 'utf8');

const writeTenMillionImages = (writer, encoding, callback) => {
  let i = 1000000;
  let round = 0;

  const write = () => {
    let ok = true;

    while (i > 0 && ok) {
      i -= 1;
      round += 1;

      if (i % 200000 === 0) {
        console.log(`${i} records to write`);
      }

      // need to give each listing some images
      for (let j = 0; j < (getRandomInt(15, 45)); j++) {
        const img = getImageUrls(i);
        const data = `${round},${img}\n`;
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

writeTenMillionImages(writeImages, 'utf-8', () => {
  writeImages.end();
});