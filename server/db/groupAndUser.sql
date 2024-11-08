-- DROP TABLE IF EXISTS groups;
-- DROP TABLE IF EXISTS account;
-- DROP TABLE IF EXISTS group_account;

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50)
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE group_account (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, account_id)
);

INSERT INTO groups (name) VALUES ('group1'), ('group2');
INSERT INTO account (email, password) VALUES ('test1@gmail.com', 'P1');
INSERT INTO account (email, password) VALUES ('test2@gmail.com', 'P2');

INSERT INTO group_account (group_id, account_id) VALUES (1, 1);
INSERT INTO group_account (group_id, account_id) VALUES (1, 2);
INSERT INTO group_account (group_id, account_id) VALUES (2, 1);

-- SELECT * from account;
-- SELECT * from groups;