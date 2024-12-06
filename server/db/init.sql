BEGIN;
DROP TABLE IF EXISTS comment;
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
  description VARCHAR(255) NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  movie_id VARCHAR(255),
  CONSTRAINT chk_movie_id_format CHECK (movie_id ~ '^(t|m)[0-9]+$')
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

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES group_post(post_id) ON DELETE CASCADE,  
    writer_id INTEGER REFERENCES account(id) ON DELETE CASCADE, 
    content VARCHAR(500) NOT NULL,        
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

COMMIT;

BEGIN;

INSERT INTO account (email, password) VALUES ('test1@movieapp.com', '$2a$10$YLdwZAOK8qik1txBTMmFpesuL.tcZUqRg.nK7FnKII3RQ3nInhzUq');
INSERT INTO account (email, password) VALUES ('test2@movieapp.com', '$2a$10$VGvrQ4yMitvFbJHp7mXymeR5UQIOTP0iSr3xRC9q2GKO1enWXxRe.');
INSERT INTO account (email, password) VALUES ('test3@movieapp.com', '$2a$10$MbHf12hmdVAi3o4dbhTVue0yKJY/xXCfEKOydmGhaCi9sE0tOPDe2');
INSERT INTO account (email, password) VALUES ('test4@movieapp.com', '$2a$10$.fd0u2XdtZZ8AEC7C12uj.muHY2aeqrCUZ6K18YpaM4gCBMkQBlAa');
INSERT INTO account (email, password) VALUES ('test5@movieapp.com', '$2a$10$/OTHt5rQqYgBJEwzn0PcbuO5mJA2ekWSFJUDsbq0iaELqT/51ozJ6');
INSERT INTO account (email, password) VALUES ('test6@movieapp.com', '$2a$10$aMGxZ8QN6yTZK.MjxAKX8uKvVSlw2rDeUq8Xt1W7bEyfCkYEPEJNi');

INSERT INTO groups (name, description, creator_id) 
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

INSERT INTO favorite (id, account_id, content_id, title, media_type, poster_path, added_date)
VALUES
    (1, 1, 912649, 'Venom: The Last Dance', 'movie', '/aosm8NMQ3UyoBVpSxyimorCQykC.jpg', '2024-12-04 18:47:55.266097'),
    (2, 1, 1106739, 'Juror #2', 'movie', '/ugQkpGajKFQ8eyOEhGheR0HfWQ.jpg', '2024-12-04 18:47:59.352444'),
    (3, 1, 1241982, 'Moana 2', 'movie', '/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg', '2024-12-04 19:01:30.252438'),
    (4, 1, 38715, 'Sinterklaasjournaal', 'tv', '/thOkUNMen2b4KJKeH2k02jNCcI2.jpg', '2024-12-04 19:01:35.048317'),
    (5, 1, 402431, 'Wicked', 'movie', '/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg', '2024-12-04 19:01:38.594947'),
    (6, 1, 645757, 'That Christmas', 'movie', '/bX6dx2U4hOk1esI7mYwtD3cEKdC.jpg', '2024-12-04 19:01:42.201784'),
    (7, 1, 113779, 'Hallo Hessen', 'tv', '/zRGme9GL0H5RmwzxKYzoXafcRDp.jpg', '2024-12-04 19:01:45.674308'),
    (8, 1, 248890, 'Ready Steady Cook South Africa', 'tv', '/30xX4IMbgnMbQwo76xM4BOSokZO.jpg', '2024-12-04 19:01:52.182516'),
    (9, 1, 18770, 'Gran Hermano', 'tv', '/gQ0Emh2LT047Fip2HWye3NkrkQB.jpg', '2024-12-04 19:01:57.284802'),
    (10, 1, 94722, 'Tagesschau', 'tv', '/7dFZJ2ZJJdcmkp05B9NWlqTJ5tq.jpg', '2024-12-04 19:02:01.064205'),
    (11, 1, 261033, 'The Agent', 'tv', '/qUtgaa43jTELs0Tdw55aIukt9yn.jpg', '2024-12-04 19:02:05.548554'),
    (12, 1, 791042, 'Levels', 'movie', '/y1xm0jMIlx9Oo2a3jWNyLGm43sJ.jpg', '2024-12-04 19:02:10.927379'),
    (13, 1, 1034541, 'Terrifier 3', 'movie', '/63xYQj1BwRFielxsBDXvHIJyXVm.jpg', '2024-12-04 19:02:14.087972'),
    (14, 1, 995803, 'Arena Wars', 'movie', '/4dRtXjk1rcsZlaMJpBn6Nh9cTfO.jpg', '2024-12-04 19:02:18.08618');

INSERT INTO review (movie_id, user_id, description, rating, reviewer_email, timestamp)
VALUES
    (912649, 1, 'An amazing movie with stunning visuals and a gripping storyline!', 4.5, 'test1@movieapp.com', '2024-12-04 20:00:00'),
    (1106739, 2, 'A thought-provoking story with outstanding performances.', 4.0, 'test2@movieapp.com', '2024-12-04 20:15:00'),
    (1241982, 3, 'Good sequel, but it lacks the charm of the original.', 3.5, 'test3@movieapp.com', '2024-12-04 20:30:00'),
    (38715, 4, 'A fun and light-hearted show, perfect for the holidays!', 4.2, 'test4@movieapp.com', '2024-12-04 20:45:00'),
    (645757, 5, 'Heartwarming and entertaining. A must-watch for families.', 5.0, 'test5@movieapp.com', '2024-12-04 21:00:00'),
    (248890, 6, 'Interesting concept, but it didn’t live up to the hype.', 2.8, 'test6@movieapp.com', '2024-12-04 21:15:00'),
    (1034541, 1, 'Terrifying and thrilling! A horror fan’s dream movie.', 4.8, 'test1@movieapp.com', '2024-12-04 21:30:00');


COMMIT;