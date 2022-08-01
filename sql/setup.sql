-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists authors_books;
drop table if exists books;
drop table if exists authors;

create table authors (
    id bigint generated always as identity primary key,
    name varchar not null,
    dob date,
    pob varchar
);

insert into authors (name, dob, pob) values
('J.R.R. Tolkien', 'January 3, 1892', 'Bloemfontein, Orange Free State'),
('Frank Herbert', 'October 8, 1920', 'Tacoma, Washington, U.S.'),
('Dan Simmons', 'April 4, 1948', 'Peoria, Illinois, U.S.');

create table books (
    id bigint generated always as identity primary key,
    title varchar not null,
    released smallint not null
);

insert into books (title, released) values
('The Hobbit', 1937),
('The Fellowship of the Ring', 1954),
('The Two Towers', 1954),
('The Return of the King', 1955),
('Dune', 1965),
('Dune Messiah', 1969),
('Children of Dune', 1976),
('God Emperor of Dune', 1981),
('Hyperion', 1989),
('The Fall of Hyperion', 1990),
('Endymion', 1996),
('The Rise of Endymion', 1997);

create table authors_books (
    id bigint generated always as identity primary key,
    author_id bigint not null,
    book_id bigint not null,
    foreign key (author_id) references authors(id),
    foreign key (book_id) references  books(id)
);

insert into authors_books (author_id, book_id) values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12);
