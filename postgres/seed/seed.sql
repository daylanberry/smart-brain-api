BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) values ('Tim', 'tim@gmail.com', 5, '2018-01-01');

INSERT INTO login (hash, email) values ('$2a$10$J1qfZ7ABx1.FjsZFbZ.Ya.r4BMLua534QBS1MjGpSzN2B1VApS9.u', 'tim@gmail.com');

COMMIT;