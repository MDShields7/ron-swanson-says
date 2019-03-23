INSERT INTO rs_rating
(rs_r_u_id, rs_r_q_id, rs_rating)
VALUES
($1, $2, $3) RETURNING *;