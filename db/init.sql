DROP TABLE IF EXISTS rs_rating;
DROP TABLE IF EXISTS rs_quotes;
DROP TABLE IF EXISTS rs_users;

CREATE TABLE rs_quotes (
  rs_q_id SERIAL PRIMARY KEY,
  rs_q_saying VARCHAR(250) NOT NULL,
  rs_q_type VARCHAR(6) NOT NULL
);
INSERT INTO rs_quotes 
(rs_q_saying, rs_q_type)
VALUES
('Test', 'small'),
('Test two', 'medium'),
('Test three is bigger', 'large');

CREATE TABLE rs_users (
  rs_u_id SERIAL PRIMARY KEY,
  rs_u_ip VARCHAR(50) NOT NULL
);
INSERT INTO rs_users 
(rs_u_ip)
VALUES
('1.1.1.1'),
('2.2.2.2'),
('3.3.3.3');

CREATE TABLE rs_rating (
  rs_id SERIAL PRIMARY KEY,
  rs_r_q_id INTEGER NOT NULL REFERENCES rs_quotes(rs_q_id),
  rs_r_u_id INTEGER NOT NULL REFERENCES rs_users(rs_u_id),
  rs_rating INTEGER NOT NULL
);
INSERT INTO rs_rating
(rs_r_u_id, rs_r_q_id, rs_rating)
VALUES
(1,1,5),
(1,2,3),
(2,1,2),
(2,2,1),
(2,3,1),
(3,1,4),
(3,2,3),
(3,3,5);

SELECT * FROM rs_quotes;
SELECT * FROM rs_users;
SELECT * FROM rs_rating;