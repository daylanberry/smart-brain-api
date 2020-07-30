BEGIN TRANSACTION;

CREATE TABLE login (
    id serial PRIMARY key,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

COMMIT;