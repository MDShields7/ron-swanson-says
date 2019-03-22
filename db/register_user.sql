INSERT INTO rs_users
(rs_u_ip)
VALUES
($1) RETURNING *;

