-- schema.sql

CREATE TABLE Ogrenci (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    deptid INT,
    counter INT
);

CREATE TABLE Bolum (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    dept_std_id INT
);
CREATE TABLE Ogrenci_Bolum (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Ogrenci(id),
    dept_id INT REFERENCES Bolum(id)
);

CREATE TABLE Ogrenci_Sayac(
    id SERIAL PRIMARY KEY,
    sayac INT DEFAULT 0
)


