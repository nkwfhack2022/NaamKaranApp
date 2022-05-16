--select schema_name(t.schema_id) as schema_name,
--       t.name as table_name,
--       t.create_date,
--       t.modify_date
--from sys.tables t
--order by schema_name,
--         table_name;

-- Create the DB

--CREATE TABLE Audio (
--    AudioId int NOT NULL PRIMARY KEY IDENTITY(1000,1),
--    AudioType char NOT NULL,
--    AudioB64 varbinary(max),
--    BlobAddress varchar(max)
--);

--CREATE TABLE Names (
--    NameId int NOT NULL PRIMARY KEY IDENTITY(2000,1),
--    PrefName varchar(255) NOT NULL,
--    AudioId int NOT NULL FOREIGN KEY REFERENCES Audio(AudioId) ON DELETE CASCADE ON UPDATE CASCADE    
--);

--CREATE TABLE AudioTraits (
--    TraitId int NOT NULL PRIMARY KEY IDENTITY(3000,1),
--    Language varchar(50) NOT NULL,
--    Locale varchar(10) NOT NULL,
--    Gender varchar(10) NOT NULL,
--    VoiceName varchar(100) NOT NULL
--);

--CREATE TABLE Users (
--    UserId varchar(50) NOT NULL PRIMARY KEY,
--    LastName varchar(255) NOT NULL,
--    FirstName varchar(255) NOT NULL,
--    MiddleName varchar(255),
--    Pswd varchar(255) NOT NULL,
--    NameId int,
--    Gender varchar(10) NOT NULL,
--    Nationality varchar(50) NOT NULL,
--    Language varchar(50) NOT NULL,
--    TraitId int FOREIGN KEY REFERENCES AudioTraits(TraitId),
--    UseChoice char,
--    Pace char
--);

-- Test DB Features

--INSERT INTO Audio (AudioType, AudioB64)
--VALUES ('M', CONVERT(varbinary(max), 'binary audio encoding in b64'));

--INSERT INTO Audio (AudioType, BlobAddress)
--VALUES ('A', 'blob storate https download link');

--INSERT INTO Names (PrefName, AudioId)
--VALUES ('Prabin', 1000);

--INSERT INTO AudioTraits (Language, Locale, Gender, VoiceName)
--VALUES ('English (India)', 'en-IN', 'Male', 'en-IN-PrabhatNeural');

--INSERT INTO AudioTraits (Language, Locale, Gender, VoiceName)
--VALUES ('English (India)', 'en-IN', 'Female', 'en-IN-NeerjaNeural');

--INSERT INTO AudioTraits (Language, Locale, Gender, VoiceName)
--VALUES ('English (United States)', 'en-US', 'Female', 'en-US-AmberNeural');

--INSERT INTO AudioTraits (Language, Locale, Gender, VoiceName)
--VALUES ('English (United States)', 'en-US', 'Male', 'en-US-BrandonNeural');

--INSERT INTO Users (UserId, LastName, FirstName, MiddleName, Pswd, NameId, Gender, Nationality, Language, TraitId, UseChoice, Pace)
--VALUES ('u791553', 'Rath', 'Prabin', 'Kumar', 'password', 0, 'Male', 'India', 'English', 3000, 'Y', 'F');

SELECT * FROM Audio
SELECT * FROM Names
SELECT * FROM AudioTraits
SELECT * FROM Users

--SELECT IDENT_CURRENT('Names')

--DELETE FROM Users WHERE UserId=4000;
--DELETE FROM Audio WHERE AudioId=1000;

--SELECT * FROM Audio
--SELECT * FROM Names
--SELECT * FROM AudioTraits
--SELECT * FROM Users

-- Clean the DB

--DROP TABLE Users;
--DROP TABLE AudioTraits;
--DROP TABLE Names;
--DROP TABLE Audio;

-- Delete Columns

--DELETE FROM Users WHERE UserId=4002;

--DELETE FROM Users;
--DELETE FROM AudioTraits;
--DELETE FROM Audio;