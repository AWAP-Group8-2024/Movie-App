
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
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER REFERENCES account(id) ON DELETE CASCADE -- Use "account" as reference
);

-- Association table for group members
CREATE TABLE group_members (
    account_id INTEGER REFERENCES account(id),
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'pending', -- status options: 'pending', 'accepted', 'rejected'
    PRIMARY KEY (account_id, group_id)
);
CREATE TABLE membership_requests (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table to manage content associated with groups
CREATE TABLE group_content (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    content_type VARCHAR(50), -- 'movie' or 'showtime'
    content_id INTEGER,
    added_by INTEGER REFERENCES account(id) -- References user who added the content
);

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
