INSERT INTO rs_quotes 
(rs_q_saying, rs_q_type)
VALUES
($1, $2) RETURNING *;