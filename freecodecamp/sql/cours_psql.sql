sudo service postgresql start
psql --username=freecodecamp --dbname=postgres
\l
\c database_name
\d -- \d table_name

CREATE DATABASE database_name;
ALTER DATABASE first_database RENAME TO mario_database;
DROP DATABASE second_database;

CREATE TABLE table_name();
DROP TABLE first_table;

ALTER TABLE more_info ADD COLUMN more_info_id SERIAL;
ALTER TABLE more_info ADD COLUMN height INT;
ALTER TABLE more_info ADD COLUMN weight NUMERIC(4, 1);
ALTER TABLE characters DROP COLUMN homeland;
ALTER TABLE second_table RENAME COLUMN name TO username;
ALTER TABLE more_info ALTER COLUMN character_id SET NOT NULL;

ALTER TABLE more_info ADD PRIMARY KEY(more_info_id);
ALTER TABLE characters DROP CONSTRAINT characters_pkey;
ALTER TABLE more_info ADD UNIQUE(character_id);
