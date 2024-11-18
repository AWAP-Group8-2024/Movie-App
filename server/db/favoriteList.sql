BEGIN;
DROP TABLE IF EXISTS favorite;

CREATE TABLE favorite (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    imdb_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    poster_path VARCHAR(255),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;