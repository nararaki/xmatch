CREATE DATABASE IF NOT EXISTS xmatch;
USE xmatch;

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);