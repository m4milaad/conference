create database conference;
use conference;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL ,
  password VARCHAR(255) NOT NULL 
);

CREATE TABLE committee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  committee_type VARCHAR(255),
  sub_committee VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(255),
  organization VARCHAR(255),
  country VARCHAR(255)
);	

INSERT INTO admins (username, password)
VALUES ('admin', 'admin@1234');

SELECT * FROM committee;
ALTER TABLE committee CHANGE sub_committee sub_committe VARCHAR(255);
