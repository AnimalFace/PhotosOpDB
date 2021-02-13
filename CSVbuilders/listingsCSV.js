const faker = require('faker');
const fs = require('fs');

const getRandomInt = (min, max) => {
    return faker.random.number({
      min,
      max,
    });
}

const possibleTags = ['For Sale', 'For Rent', 'New', 'New Construction', 'Off Market'];
const tagIndex = getRandomInt(0, possibleTags.length);

const getImageUrls = (num) => {
  // Set houseNum to num % number of house images available
  let houseNum = num % 21;
  if (houseNum === 0) {
    houseNum = 1;
  }
  const house = `https://homeimgs.s3-us-west-1.amazonaws.com/truliaHomes/${houseNum}.1.jpg`;

  return house;
};

const generateRandomLengthPhotoArray = (num) => {
  let photoArray = [];
  for (let i = 0; i < (getRandomInt(15, 45)); i++) {
    photoArray.push(getImageUrls(num));
  }
  return photoArray.join(' ');
}

const writeListings = fs.createWriteStream('listings.csv');
writeListings.write('tags,price,line1,line2,numBeds,numBaths,sqft,views,images\n', 'utf8');

const writeTenMillionListings = (writer, encoding, callback) => {
  let i = 5000000;

  const write = () => {
    let ok = true;

    while (i > 0 && ok) {
      i -= 1;
      if (i % 200000 === 0) {
        console.log(`${i} records to write`);
      }

      const tags = [possibleTags[tagIndex]];
      const price = getRandomInt(100, 300) * 100000;
      const line1 = faker.address.streetAddress();
      const line2 = faker.fake('{{address.city}} {{address.stateAbbr}}');
      const numBeds = getRandomInt(2, 8);
      const numBaths = getRandomInt(2, 8);
      const sqft = getRandomInt(4000, 10000);
      const views = getRandomInt(0, 10000);
      const images = generateRandomLengthPhotoArray(i);


      const data = `{${tags}},${price},${line1},${line2},${numBeds},${numBaths},${sqft},${views},{${images}}\n`;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
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

writeTenMillionListings(writeListings, 'utf-8', () => {
  writeListings.end();
});