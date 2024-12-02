BEGIN;
DROP TABLE IF EXISTS review;
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    movie_id INT,
    user_id INT REFERENCES account(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    rating DOUBLE PRECISION CHECK (rating BETWEEN 0 AND 5),
    reviewer_email VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;


