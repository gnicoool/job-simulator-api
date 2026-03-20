CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    song TEXT,
    artist TEXT,
    album TEXT,
    year_realise integer,
    duration_sec float,
    grammy boolean
);

INSERT INTO songs (song, artist, album, year_realise, duration_sec, grammy) 
VALUES 
    ('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 1975, 354.5, true),
    ('Shape of You', 'Ed Sheeran', '÷', 2017, 233.8, false),
    ('Rolling in the Deep', 'Adele', '21', 2010, 228.4, true),
    ('Blinding Lights', 'The Weeknd', 'After Hours', 2019, 200.2, true),
    ('Despacito', 'Luis Fonsi', 'Vida', 2017, 229.0, false);
