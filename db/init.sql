DROP TABLE IF EXISTS rs_quotes;
DROP TABLE IF EXISTS rs_users;

CREATE TABLE rs_quotes (
  rs_q_id SERIAL PRIMARY KEY,
  rs_q_saying VARCHAR(250) NOT NULL,
  rs_q_type VARCHAR(6) NOT NULL,
);
INSERT INTO rs_quotes 
(rs_q_saying, rs_q_type)
VALUES
(`I don't want to paint with a broad brush here, but every single contractor in the world is a miserable, incompetent thief.`, 'large'),
(`I like saying ‘No,’ it lowers their enthusiasm.`, 'large');

CREATE TABLE rs_users (
  rs_u_id SERIAL PRIMARY KEY,
  rs_u_name VARCHAR(250) NOT NULL,
);
INSERT INTO rs_quotes 
(rs_q_name)
VALUES
('a');

CREATE TABLE rs_stars (
  rs_s_id SERIAL PRIMARY KEY,
  rs_s_name VARCHAR(250) NOT NULL,
);
INSERT INTO rs_quotes 
(rs_q_name)
VALUES
('a');

