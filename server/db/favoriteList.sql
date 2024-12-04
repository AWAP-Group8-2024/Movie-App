BEGIN;
DROP TABLE IF EXISTS favorite;

CREATE TABLE favorite (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    content_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    poster_path VARCHAR(255),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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


COMMIT;