
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS group;
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS theater;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS group_account;
DROP TABLE IF EXISTS favorite;

-- For user
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

-- For content
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('movie', 'tv_series')),
    release_date DATE
);
CREATE TABLE theater (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movie(id) ON DELETE CASCADE,
    user_id INT REFERENCES account(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    reviewer_email VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Junction table
CREATE TABLE group_account (
    group_id INTEGER REFERENCES group(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, account_id)
);
CREATE TABLE favorite (
    user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, content_id)
);


-- SELECT * FROM task
-- SELECT * FROM account
