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

ALTER TABLE more_info ADD COLUMN character_id INT
REFERENCES characters(character_id);

ALTER TABLE sounds ADD COLUMN character_id INT NOT NULL 
REFERENCES characters(character_id);

INSERT INTO second_table(id, username)
VALUES(3, 'Luigi');


DELETE FROM second_table WHERE username='Samus';

INSERT INTO more_info(birthday, height, weight, character_id)
VALUES('1990-04-13', 162, 59.1, 7);

update characters set homeland='Koopa Kingdom'
where name = 'Bowser'  RETURNING *;

SELECT * FROM characters ORDER BY character_id;

Alter table more_info rename column weight to weight_in_kg;

create table actions(
  action_id SERIAL PRIMARY KEY
);

alter table actions add column action varchar(20) not null unique; 

INSERT INTO sounds(filename, character_id)
VALUES('mm-hmm.wav', 3),
('yahoo.wav', 1);

INSERT INTO actions(action)
VALUES('run');


alter table character_actions add column character_id int not null; 
alter table character_actions add column action_id int not null; 

alter table character_actions add foreign key(character_id)
references characters(character_id);

alter table character_actions add foreign key(action_id)
references actions(action_id);

ALTER TABLE character_actions 
ADD PRIMARY KEY(character_id, action_id);

INSERT INTO character_actions(character_id, action_id)
VALUES(1, 1),
(1, 2),
(1, 3);

Select * 
from characters c
full join sounds s
on c.character_id = s.character_id;

SELECT * FROM character_actions cs
FULL JOIN characters c ON cs.character_id = c.character_id
FULL JOIN actions a ON cs.action_id = a.action_id;