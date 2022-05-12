--select schema_name(t.schema_id) as schema_name,
--       t.name as table_name,
--       t.create_date,
--       t.modify_date
--from sys.tables t
--order by schema_name,
--         table_name;

-- Create the DB

CREATE TABLE Audio (
    AudioId int NOT NULL PRIMARY KEY IDENTITY(1000,1),
    AudioB64 varbinary(max)
);

CREATE TABLE Names (
    NameId int NOT NULL PRIMARY KEY IDENTITY(2000,1),
    PrefName varchar(255),
    AudioId int FOREIGN KEY REFERENCES Audio(AudioId) ON DELETE CASCADE ON UPDATE CASCADE,
    AudioType char
);

CREATE TABLE Users (
    UserId int NOT NULL PRIMARY KEY IDENTITY(3000,1),
    LastName varchar(255),
    FirstName varchar(255),
    MiddleName varchar(255),
    Pswd varchar(255),
    NameId int FOREIGN KEY REFERENCES Names(NameId),
    Gender char,
    Nationality varchar(50),
    Language varchar(50),
    UseChoice char,
    Pace char
);

-- Test DB Features

--INSERT INTO Audio(AudioB64)
--VALUES (CONVERT(varbinary(max), 'Hello_Music'));

--INSERT INTO Names (PrefName, AudioId, AudioType)
--VALUES ('Prabin', 1000, 'A');

--INSERT INTO Users (LastName, FirstName, MiddleName, Pswd, NameId, Gender, Nationality, Language, UseChoice, Pace)
--VALUES ('Rath', 'Prabin', 'Kumar', 'password', 2000, 'M', 'India', 'English', 'Y', 'F');

--SELECT * FROM Audio
--SELECT * FROM Names
--SELECT * FROM Users

--DELETE FROM Users WHERE UserId=3000;
--DELETE FROM Audio WHERE AudioId=1000;

--SELECT * FROM Audio
--SELECT * FROM Names
--SELECT * FROM Users

-- Clean the DB

--DROP TABLE Users;
--DROP TABLE Names;
--DROP TABLE Audio;