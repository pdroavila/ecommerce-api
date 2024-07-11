CREATE DATABASE IF NOT EXISTS ecommerce;

create table produtos
(
    id        int auto_increment
        primary key,
    nome      varchar(50)    not null,
    descricao text           not null,
    valor     decimal(10, 2) not null,
    imagem    varchar(100)   not null
);

create table usuarios
(
    id    int auto_increment
        primary key,
    nome  varchar(50)       not null,
    email varchar(100)      not null,
    senha varchar(200)      not null,
    admin tinyint default 0 not null,
    hash  varchar(300)      not null
);

create table pedidos
(
    id         int auto_increment
        primary key,
    id_usuario int                                not null,
    produtos   json                               null,
    total      decimal(10, 2)                     null,
    data       datetime default CURRENT_TIMESTAMP null,
    constraint pedidos_usuarios_id_fk
        foreign key (id_usuario) references usuarios (id)
);



-- Insert's sugeridos:
INSERT INTO usuarios (nome, email, senha, admin, hash) VALUES ('Admin', 'teste@gmail.com', 'aa1bf4646de67fd9086cf6c79007026c', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lU3RhbXAiOjE3MTQ1ODY4NDMzMDYsImVtYWlsIjoidGVzdGVAZ21haWwuY29tIiwic2VuaGEiOiJ0ZXN0ZTEyMyIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTQ1ODY4NDN9.Jmojd-wBWjHC8KmcRsWAffHbWh4smn2YXEqX-mNGNCc');