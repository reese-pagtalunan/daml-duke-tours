CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE Buildings(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    lat FLOAT,
    long FLOAT,
    description TEXT,
    address VARCHAR(255),
    official_name VARCHAR(100),
    aliases TEXT,
    category VARCHAR(50),
    campus VARCHAR(50),
    official_url TEXT,
    architecture_style VARCHAR(50),
    notable_features TEXT,
    primary_function TEXT
);

CREATE TABLE Building_images(
    image_id SERIAL PRIMARY KEY,
    building_id INTEGER REFERENCES Buildings(id),
    image_url TEXT,
    embedding_vector VECTOR(512)
);


INSERT INTO Buildings (name, lat, long, address, official_name, aliases, category, campus, official_url, architecture_style, primary_function, notable_features) VALUES
('Perkins Library', 36.0023296117547, -78.93850852001916, 'Campus Dr, Durham, NC 27708', 'William R. Perkins Library', null, 'academic', 'West Campus', 'https://library.duke.edu', 'Collegiate Gothic', 'Main academic library', 'Large study spaces, Research support services, Popular late-night study location'),
('Duke Chapel', 36.00226921588706, -78.94027373066305, '401 Chapel Dr, Durham, NC 27708', 'Duke University Chapel', null, 'landmark_religious', 'West Campus', 'https://chapel.duke.edu', 'Gothic', 'Interdenominational Christian chapel and university landmark', '210-foot tower, Stained glass windows, Host to major university events'),
('Bryan Center', 36.00180620752485, -78.94168876374286, '125 Science Dr, Durham, NC 27710', 'Bryan University Center', null, 'student_life', 'West Campus', 'https://maps.duke.edu/?focus=96', null, 'Student activity and event space', 'Home to student organization offices, Meeting rooms and event spaces'),
('Wilson Recreation Center', 35.997692394999, -78.94130917299191, '330 Towerview Rd, Durham, NC 27708', 'Wilson Recreation Center', 'Wilson', 'recreation', 'West Campus', 'https://recreation.duke.edu', null, 'Campus recreation and fitness facility', 'Gym facilities, Indoor track, Group fitness classes, Swimming pool'),
('Wilkinson Building', 36.00358988440017, -78.93771799257846, '534 Research Dr, Durham, NC 27705', 'Wilkinson Building', null, 'academic', 'West Campus', 'https://www.bcj.com/projects/academic/duke-university-pratt-school-of-engineering-building/', null, 'Academic and research space for the Pratt School of Engineering', 'Flexible teaching laboratories, Collaborative learning spaces, Faculty offices and research areas'),
('Broadhead Center', 36.00115290473519, -78.93877717723585, '416 Chapel Dr, Durham, NC 27710', 'The Brodhead Center', 'West Union, WU', 'dining_student_life', 'West Campus', 'https://students.duke.edu/living/dining/dining-locations/', null, 'Main dining and student gathering space', 'Multiple dining vendors, Central social hub, Popularly known as West Union');