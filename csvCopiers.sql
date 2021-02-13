COPY listings(tags, price, line1, line2, numBeds, numBaths, sqft, views, images)
FROM '/home/ubuntu/listings.csv'
DELIMITER ','
CSV HEADER;

COPY users(username, pword, first_name, last_name, email)
FROM '/home/ubuntu/users.csv'
DELIMITER ','
CSV HEADER;

COPY images(listing_id, img)
FROM '/home/ubuntu/images.csv'
DELIMITER ','
CSV HEADER;

COPY favorites(userid, listing_id)
FROM '/home/ubuntu/favorites.csv'
DELIMITER ','
CSV HEADER;