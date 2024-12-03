BEGIN;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS join_requests;
DROP TABLE IF EXISTS group_account;
DROP TABLE IF EXISTS group_post;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS account;
COMMIT;

BEGIN;

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    address VARCHAR(50),
    phone VARCHAR(50)
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    creator_id INTEGER REFERENCES account(id) ON DELETE SET NULL
);

CREATE TABLE group_account (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, account_id)
);

CREATE TABLE group_post (
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  writer_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
  post_id SERIAL PRIMARY KEY,
  description varchar(255) not null,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE join_requests (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP
);

CREATE TABLE favorite (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    content_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    poster_path VARCHAR(255),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    movie_id INT,
    user_id INT REFERENCES account(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    rating DOUBLE PRECISION CHECK (rating BETWEEN 0 AND 5),
    reviewer_email VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO account (email, password) VALUES ('test1@123.com', '$2b$10$.bgHzCIBMOPDcSJ1LHpQgel7W5KlSg53ss9UIbtk1/Bq2r60Nwuu.');
INSERT INTO account (email, password) VALUES ('test2@123.com', '$2b$10$V/kgVRzhzoS/BaxGqNT/.e8X7aeHToNyJkuckWrJVxDkEoWeouaqC');
INSERT INTO account (email, password) VALUES ('test3@123.com', '$2b$10$XCncdULQh/pfmE1esyXiTeqJSHmOWHutaWkXMbGCRR6/XqV.EucLi');
INSERT INTO account (email, password) VALUES ('test4@123.com', '$2b$10$LRr/wfzizgtkNVc43dBXO.1vklFtRTWG6sxHKpiIEVMoNVajMoSc.');
INSERT INTO account (email, password) VALUES ('test5@123.com', '$2b$10$HqXkzyANdNq0.0CLvqVHWeDSJSuSYyv9y17G8xNs5hZIdIxFK/ZhK');
INSERT INTO account (email, password) VALUES ('test6@123.com', '$2b$10$yiouJ7CNI1Qf4tswmc8Wr.4gdGXzVmvyTnFwwQDzqsTz/ulynPNuy');

INSERT INTO groups  (name, description, creator_id) 
VALUES ('group1', 'group1 desc', 1), ('group2','group2 desc', 2), ('group3', 'group1 desc', 3);

INSERT INTO group_account (group_id, account_id) VALUES (1, 1);
INSERT INTO group_account (group_id, account_id) VALUES (1, 2);
INSERT INTO group_account (group_id, account_id) VALUES (2, 2);
INSERT INTO group_account (group_id, account_id) VALUES (2, 3);
INSERT INTO group_account (group_id, account_id) VALUES (2, 4);
INSERT INTO group_account (group_id, account_id) VALUES (3, 1);
INSERT INTO group_account (group_id, account_id) VALUES (3, 2);
INSERT INTO group_account (group_id, account_id) VALUES (3, 3);
INSERT INTO group_account (group_id, account_id) VALUES (3, 4);

INSERT INTO join_requests (group_id, account_id) VALUES (1, 4);
INSERT INTO join_requests (group_id, account_id) VALUES (2, 5);
INSERT INTO join_requests (group_id, account_id) VALUES (3, 6);

INSERT INTO group_post (group_id, writer_id, description) VALUES (1, 1, 'post1');
INSERT INTO group_post (group_id, writer_id,  description) VALUES (2, 2, 'post2');
COMMIT;