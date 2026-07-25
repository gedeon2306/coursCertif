-- 1. Création et connexion à la base de données
DROP DATABASE IF EXISTS universe;
CREATE DATABASE universe;
\c universe

-- 2. Création de la table galaxy
CREATE TABLE galaxy (
    galaxy_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    age_in_millions_of_years INT NOT NULL,
    is_spherical BOOLEAN
);

-- 3. Création de la table star
CREATE TABLE star (
    star_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    galaxy_id INT REFERENCES galaxy(galaxy_id) NOT NULL,
    mass_solar NUMERIC,
    is_active BOOLEAN NOT NULL
);

-- 4. Création de la table planet
CREATE TABLE planet (
    planet_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    star_id INT REFERENCES star(star_id) NOT NULL,
    distance_from_earth INT,
    has_life BOOLEAN NOT NULL
);

-- 5. Création de la table moon
CREATE TABLE moon (
    moon_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    planet_id INT REFERENCES planet(planet_id) NOT NULL,
    radius_km INT,
    is_locked BOOLEAN
);

-- 6. Création d'une 5ème table pour respecter la consigne
CREATE TABLE galaxy_type (
    galaxy_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    rarity_score INT
);

-- Insertion

-- Galaxies
INSERT INTO galaxy (name, description, age_in_millions_of_years, is_spherical) VALUES
('Milky Way', 'Our home galaxy', 13600, false),
('Andromeda', 'Nearest major galaxy', 10010, false),
('Triangulum', 'Member of the Local Group', 12000, false),
('Sombrero', 'Unbarred spiral galaxy', 13250, false),
('Whirlpool', 'Interacting grand-design spiral galaxy', 400000, false),
('Messier 87', 'Supergiant elliptical galaxy', 13300, true);

-- Étoiles
INSERT INTO star (name, galaxy_id, mass_solar, is_active) VALUES
('Sun', 1, 1.0, true),
('Sirius', 1, 2.02, true),
('Betelgeuse', 1, 16.5, true),
('Alpha Centauri A', 1, 1.1, true),
('Alpheratz', 2, 3.6, true),
('Mirach', 2, 2.5, true);

-- Planètes
INSERT INTO planet (name, star_id, distance_from_earth, has_life) VALUES
('Mercury', 1, 91, false),
('Venus', 1, 41, false),
('Earth', 1, 0, true),
('Mars', 1, 78, false),
('Jupiter', 1, 628, false),
('Saturn', 1, 1275, false),
('Uranus', 1, 2723, false),
('Neptune', 1, 4351, false),
('Sirius b I', 2, 86000, false),
('Sirius b II', 2, 86005, false),
('Betelgeuse Prime', 3, 642000, false),
('Alpha C b', 4, 43, false);

-- lunes
INSERT INTO moon (name, planet_id, radius_km, is_locked) VALUES
('Moon', 3, 1737, true),
('Phobos', 4, 11, true),
('Deimos', 4, 6, true),
('Io', 5, 1821, true),
('Europa', 5, 1560, true),
('Ganymede', 5, 2634, true),
('Callisto', 5, 2410, true),
('Titan', 6, 2574, true),
('Enceladus', 6, 252, true),
('Mimas', 6, 198, true),
('Rhea', 6, 763, true),
('Dione', 6, 561, true),
('Tethys', 6, 531, true),
('Iapetus', 6, 734, true),
('Titania', 7, 788, true),
('Oberon', 7, 761, true),
('Umbriel', 7, 584, true),
('Ariel', 7, 578, true),
('Miranda', 7, 235, true),
('Triton', 8, 1353, true);

-- Types de galaxies
INSERT INTO galaxy_type (name, description, rarity_score) VALUES
('Spiral', 'Has rotating spiral arms', 1),
('Elliptical', 'Ellipsoid shape smooth profile', 2),
('Irregular', 'Does not fit into normal classification', 3);