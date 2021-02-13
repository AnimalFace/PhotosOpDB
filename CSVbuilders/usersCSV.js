const faker = require('faker');
const fs = require('fs');

const writeUsers = fs.createWriteStream('users.csv');
writeUsers.write('username,pword,first_name,last_name,email\n', 'utf8');

const writeTenMillionUsers = (writer, encoding, callback) => {
  let i = 5000000;

  const write = () => {
    let ok = true;

    while (i > 0 && ok) {
      i -= 1;
      if (i % 200000 === 0) {
        console.log(`${i} records to write`);
      }

      const username = faker.internet.userName();
      const pword = faker.lorem.word();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();

      const data = `${username},${pword},${firstName},${lastName},${email}\n`;

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

writeTenMillionUsers(writeUsers, 'utf-8', () => {
  writeUsers.end();
});