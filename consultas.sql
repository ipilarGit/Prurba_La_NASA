cursos=# CREATE DATABASE nasa;
CREATE DATABASE
cursos=# CREATE TABLE usuarios (id SERIAL PRIMARY KEY, email VARCHAR(50), nombre VARCHAR(50), password VARCHAR(50), auth BOOLEAN);
CREATE TABLE
#cursos=# \c nasa
Ahora está conectado a la base de datos «nasa» con el usuario «postgres».
nasa=#