DROP TABLE Owns;
DROP TABLE Is_in;
DROP TABLE CPU;
DROP TABLE RAM;
DROP TABLE GPU;
DROP TABLE Req_Min;
DROP TABLE Req_Max;
DROP TABLE Req_Avg;
DROP TABLE Component_Makes;
DROP TABLE Review_Wrote_On;
DROP TABLE R2;
DROP TABLE R1;
DROP TABLE Assembles;
DROP TABLE Users;
DROP TABLE Build;
DROP TABLE Manufacturer;
DROP TABLE Game;

CREATE TABLE Manufacturer (
  Manufacturer_name Char(100),
  Country Char(100),
  PRIMARY KEY (Manufacturer_name)
);

CREATE TABLE Users (
  Uid Char(100),
  Email Char(100),
  Fname Char(100),
  Lname Char(100),
  Pword Char(100),
  PRIMARY KEY (Uid)
);

CREATE TABLE Game (
  Game_name Char(100),
  Producer Char(100),
  Release_Date Char(100),
  PRIMARY KEY (Game_name)
);

CREATE TABLE Component_Makes (
  Cid Char(100),
  Component_name Char(100),
  Cost Int,
  Manufacturer_name Char(100),
  PRIMARY KEY (Cid),
  FOREIGN KEY (Manufacturer_name) REFERENCES Manufacturer
);

CREATE TABLE CPU (
  Cid Char(100),
  speed Int,
  PRIMARY KEY (Cid),
  FOREIGN KEY (Cid) REFERENCES Component_Makes
);

CREATE TABLE GPU (
  Cid Char(100),
  cores Int,
  PRIMARY KEY (Cid),
  FOREIGN KEY (Cid) REFERENCES Component_Makes
);

CREATE TABLE RAM (
  Cid Char(100),
  Capacity Int,
  PRIMARY KEY (Cid),
  FOREIGN KEY (Cid) REFERENCES Component_Makes
);

CREATE TABLE Build (
  Name Char(100),
  Bid Char(100),
  PRIMARY KEY (Bid)
);

CREATE TABLE Assembles (
  Bid Char(100),
  Manufacturer_name Char(100),
  PRIMARY KEY (Bid),
  FOREIGN KEY (Manufacturer_name) REFERENCES Manufacturer,
  FOREIGN KEY (Bid) REFERENCES Build
);

CREATE TABLE R1 (
  Rid Char(100),
  Text Char(2000),
  PRIMARY KEY (Rid)
);

CREATE TABLE R2 (
  Rid Char(100),
  Game_Name Char(100),
  Bid Char(100),
  Passes Char(1),
  PRIMARY KEY (Rid, Bid, Game_Name),
  FOREIGN KEY (Rid) REFERENCES R1,
  FOREIGN KEY (Game_Name) REFERENCES Game,
  FOREIGN KEY (Bid) REFERENCES Build
);

CREATE TABLE Review_Wrote_On (
  Uid Char(100),
  Bid Char(100),
  Title Char(100),
  Body Char(2000),
  PRIMARY KEY (Uid, Bid),
  FOREIGN KEY (Uid) REFERENCES Users,
  FOREIGN KEY (Bid) REFERENCES Build
);

CREATE TABLE Is_In (
  Cid Char(100),
  Bid Char(100),
  PRIMARY KEY (Cid, Bid),
  FOREIGN KEY (Cid) REFERENCES Component_Makes,
  FOREIGN KEY (Bid) REFERENCES Build
);

CREATE TABLE Owns (
  Bid Char(100),
  Uid Char(100),
  PRIMARY KEY (Bid, Uid),
  FOREIGN KEY (Bid) REFERENCES Build,
  FOREIGN KEY (Uid) REFERENCES Users
);

CREATE TABLE Req_Min (
  Req_Id Char(100),
  Score Int,
  PRIMARY KEY (Req_Id),
  FOREIGN KEY (Req_Id) REFERENCES R1
);

CREATE TABLE Req_Avg (
  Req_Id Char(100),
  Score Int,
  PRIMARY KEY (Req_Id),
  FOREIGN KEY (Req_Id) REFERENCES R1 
);

CREATE TABLE Req_Max (
  Req_Id Char(100),
  Score Int,
  PRIMARY KEY (Req_Id),
  FOREIGN KEY (Req_Id) REFERENCES R1 
);

ALTER TABLE Component_Makes DROP CONSTRAINT IF EXISTS component_makes_manufacturer_name_fkey;
ALTER TABLE Component_Makes ADD CONSTRAINT component_makes_manufacturer_name_fkey FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON UPDATE CASCADE;

ALTER TABLE cpu DROP CONSTRAINT if exists cpu_cid_fkey;
ALTER TABLE cpu ADD CONSTRAINT cpu_cid_fkey FOREIGN KEY (cid) REFERENCES Component_Makes(cid) ON DELETE CASCADE;
ALTER TABLE ram DROP CONSTRAINT if exists ram_cid_fkey;
ALTER TABLE ram ADD CONSTRAINT ram_cid_fkey FOREIGN KEY (cid) REFERENCES Component_Makes(cid) ON DELETE CASCADE;
ALTER TABLE gpu DROP CONSTRAINT if exists gpu_cid_fkey;
ALTER TABLE gpu ADD CONSTRAINT gpu_cid_fkey FOREIGN KEY (cid) REFERENCES Component_Makes(cid) ON DELETE CASCADE;
ALTER TABLE Is_in DROP CONSTRAINT if exists Is_in_cid_fkey;
ALTER TABLE Is_In ADD CONSTRAINT Is_In_cid_fkey FOREIGN KEY (cid) REFERENCES Component_Makes(cid) ON DELETE CASCADE;

INSERT INTO Manufacturer (manufacturer_name, country) VALUES ('NVIDIA', 'USA');
INSERT INTO Manufacturer (manufacturer_name, country) VALUES ('Intel', 'USA');
INSERT INTO Manufacturer (manufacturer_name, country) VALUES ('AMD', 'USA');
INSERT INTO Manufacturer (manufacturer_name, country) VALUES ('iBUYPOWER', 'USA');
INSERT INTO Manufacturer (manufacturer_name, country) VALUES ('G.skill', 'Taiwan');

INSERT INTO Users (uid, email, fname, lname, pword) VALUES (1, 'jwatson@gmail.com', 'Josephine', 'Watson', 'nazzqcel7tkkre7rfniw');
INSERT INTO Users (uid, email, fname, lname, pword) VALUES (2, 'cholden@gmail.com', 'Callum', 'Holden', 'jkynhotzg3i6q9saz7eu');
INSERT INTO Users (uid, email, fname, lname, pword) VALUES (3, 'swarner@gmail.com', 'Shirley', 'Werner', 'eibf04lfm25mt549tkyi');
INSERT INTO Users (uid, email, fname, lname, pword) VALUES (4, 'rcarr@gmail.com', 'Roy', 'Car', '162m7yyuoxkyja2xodiq');
INSERT INTO Users (uid, email, fname, lname, pword) VALUES (5, 'jban@gmail.com', 'Jonah', 'Baldwin', 's8lz6n6pzmr7fehoafjb');

INSERT INTO Game (game_name, producer, release_date) VALUES ('The Elder Scrolls V: Skyrim', 'Bethesda Game Studios', '2011-11-11');
INSERT INTO Game (game_name, producer, release_date) VALUES ('Street fighter VI', 'Riot Games', '2009-10-27');
INSERT INTO Game (game_name, producer, release_date) VALUES ('The Witcher 3: Wild Hunt', 'CD Projekt RED', '2015-05-18');
INSERT INTO Game (game_name, producer, release_date) VALUES ('Guilty Gear Strive', 'Arc Studios', '2012-10-09');
INSERT INTO Game (game_name, producer, release_date) VALUES ('League of Legends', 'CD Projekt RED', '2020-12-10');


INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (1, 'Core i9 14900K', 589, 'Intel');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (2, 'Core i7 14700F', 359, 'Intel');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (3, 'Core i5 14600', 255, 'Intel');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (4, 'Ryzen 9 5900X', 359, 'AMD');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (5, 'Ryzen 5 5600G', 179, 'AMD');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (6, 'GeForce RTX 4090', 2295, 'NVIDIA');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (7, 'GeForce GTX 1070', 240, 'NVIDIA');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (8, 'GeForce GTX 1060', 550, 'NVIDIA');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (9, 'GeForce RTX 2080', 890, 'NVIDIA');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (10, 'GeForce GTX 970', 470, 'NVIDIA');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (11, 'Trident Z5 RGB', 115, 'G.skill');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (12, 'Flare X5', 105, 'G.skill');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (13, 'Trident Z7 RGB', 218, 'G.skill');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (14, 'Ripjaws V', 38, 'G.skill');
INSERT INTO Component_Makes(cid, component_name, cost, manufacturer_name) VALUES (15, 'Aegis', 43, 'G.skill');

INSERT INTO CPU(cid, speed) VALUES (1, 3.2);
INSERT INTO CPU(cid, speed) VALUES (2, 2.1);
INSERT INTO CPU(cid, speed) VALUES (3, 2.7);
INSERT INTO CPU(cid, speed) VALUES (4, 4.8);
INSERT INTO CPU(cid, speed) VALUES (5, 3.9);

INSERT INTO GPU(cid, cores) VALUES (6, 16384);
INSERT INTO GPU(cid, cores) VALUES (7, 1920);
INSERT INTO GPU(cid, cores) VALUES (8, 1280);
INSERT INTO GPU(cid, cores) VALUES (9, 2944);
INSERT INTO GPU(cid, cores) VALUES (10, 1664);

INSERT INTO Ram(cid, capacity) VALUES (11, 32);
INSERT INTO Ram(cid, capacity) VALUES (12, 32);
INSERT INTO Ram(cid, capacity) VALUES (13, 64);
INSERT INTO Ram(cid, capacity) VALUES (14, 16);
INSERT INTO Ram(cid, capacity) VALUES (15, 16);

INSERT INTO Build(bid, name) VALUES (1, 'budget build for gaming');
INSERT INTO Build(bid, name) VALUES (2, 'luxury gaming machine');
INSERT INTO Build(bid, name) VALUES (3, 'build for streaming');
INSERT INTO Build(bid, name) VALUES (4, 'my current build');
INSERT INTO Build(bid, name) VALUES (5, 'average gaming build');
INSERT INTO Build(bid, name) VALUES (6, 'RDY Y40 VALORANT VCTA B001');
INSERT INTO Build(bid, name) VALUES (7, 'Gaming RDY Y40RG201');
INSERT INTO Build(bid, name) VALUES (8, 'Starter Gaming');
INSERT INTO Build(bid, name) VALUES (9, 'Pro Gaming');
INSERT INTO Build(bid, name) VALUES (10, 'Elite Gaming');

INSERT INTO Assembles (Bid, Manufacturer_Name) VALUES (6, 'iBUYPOWER');
INSERT INTO Assembles (Bid, Manufacturer_Name) VALUES (7, 'iBUYPOWER');
INSERT INTO Assembles (Bid, Manufacturer_Name) VALUES (8, 'iBUYPOWER');
INSERT INTO Assembles (Bid, Manufacturer_Name) VALUES (9, 'iBUYPOWER');
INSERT INTO Assembles (Bid, Manufacturer_Name) VALUES (10, 'iBUYPOWER');

INSERT INTO R1(Rid, Text) VALUES (1, 'Recommend build score for Street fighter VI');
INSERT INTO R1(Rid, Text) VALUES (2, 'Highest build score for Street fighter VI');
INSERT INTO R1(Rid, Text) VALUES (3, 'Lowest build score for Street fighter VI');
INSERT INTO R1(Rid, Text) VALUES (4, 'Lowest build score for Guilty Gear Strive');
INSERT INTO R1(Rid, Text) VALUES (5, 'Lowest build score for League of Legends');
INSERT INTO R1(Rid, Text) VALUES (6, 'Highest build score for Persona 3 Reload');

INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (1, 'Street fighter VI', 1, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (2, 'Street fighter VI', 2, 0);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (3, 'Street fighter VI', 3, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (4, 'Guilty Gear Strive', 4, 0);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (5, 'League of Legends', 5, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (5, 'League of Legends', 4, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (2, 'The Elder Scrolls V: Skyrim', 5, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (2, 'The Witcher 3: Wild Hunt', 10, 1);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (1, 'Guilty Gear Strive', 5, 0);
INSERT INTO R2 (Rid, Game_Name, Bid, Passes) VALUES (4, 'Guilty Gear Strive', 5, 1);



INSERT INTO Review_Wrote_On (Uid, Bid, Title, Body)
VALUES
(1, 1, 'Small but mighty!', 'I previously used the Dell XPS 8900 (since 2016) and was very happy with it. In the last couple of years my workload has grown and the XPS just couldn''t keep up (still a great unit but it has been given a lighter task load at the office). I decided on the Dell Inspiron 3020 because of its smaller size but its ability to be as powerful as a unit twice its size. The size of the unit fits perfectly in my office and even made it possible to move my Christmas cactus in front of the window again (BONUS!). I couldn''t be happier with my decision and once again, Dell has offered an outstanding piece of equipment.'),
(2, 2, 'like :)', 'This is exactly what I needed. My 8-year-old laptop needed a break. The only thing it fell short on is having just one HDMI port, and for my work, it would be great to have two. But, well, I can fix that with an adapter. Other than that, I thought it was great that it came with a keyboard and mouse. It''s quite handy for a start.'),
(2, 3, 'good basic pc', 'Straightforward No Frills basic PC to perform most needed functions. After 4 months very happy'),
(3, 3, 'New desktop, no complaints.', 'Updated with windows 11. Works great so far!'),
(3, 4, 'Still setting the computer up.', 'Replaced my 10 year old 3rd Gen i5 computer with this 13th Gen i7 with twice the DRAM and 1TB SSD. Old one was laboring under the weight of not enough memory and old processor. This one works so much better with almost instant performance helped by the SSD. Lots of multitasking and 12TB of external drives awaits but so far I am very pleased with getting the computer set up. Windows 11 is a bit of a learning curve after Win 10 pro but with a bit of research, learning how it works and doing some tweaks. Have always been a Dell Users since the early days of PCs. Looking forward to many years of reliable service with this one.');

INSERT INTO Is_In (Cid, Bid) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5);


INSERT INTO Owns (Bid, Uid) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 4),
(2, 5);


INSERT INTO Req_Min (Req_Id, Score) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);


INSERT INTO Req_Avg (Req_Id, Score) VALUES
(1, 5),
(2, 4),
(3, 3),
(4, 2),
(5, 1);


INSERT INTO Req_Max (Req_Id, Score) VALUES
(1, 5),
(2, 4),
(3, 3),
(4, 1),
(5, 2);
