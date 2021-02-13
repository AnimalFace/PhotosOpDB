CREATE DATABASE ubuntu;

CREATE TABLE listings (
  id serial primary key,
  tags text[],
  price int,
  line1 varchar(80),
  line2 varchar(80),
  numBeds int,
  numBaths int,
  sqft int,
  images text[],
  views int
);

CREATE TABLE users (
  id serial primary key,
  username varchar(80),
  pword varchar(80),
  first_name varchar(80),
  last_name varchar(80),
  email varchar(80)
);

CREATE TABLE favorites (
  id serial primary key,
  userid int REFERENCES users (id),
  listing_id int REFERENCES listings (id)
);

CREATE TABLE images (
  id serial primary key,
  listing_id int REFERENCES listings (id),
  img text
);

CREATE INDEX favorites_userid_index ON favorites (userid);
CREATE INDEX images_listing_id_index ON images (listing_id);