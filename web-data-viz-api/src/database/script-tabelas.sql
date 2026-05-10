CREATE DATABASE pengu;
USE pengu;

DROP DATABASE pengu;

CREATE TABLE usuario (
	id 											INT PRIMARY KEY AUTO_INCREMENT,
	nome 										VARCHAR(50),
	email 									VARCHAR(50),
	senha						 				VARCHAR(50),
  especie_favorita_id 		INT,
	CONSTRAINT fk_usuario_especie FOREIGN KEY (especie_favorita_id) REFERENCES especie(id)
);

CREATE TABLE especie (
  id 								INT PRIMARY KEY AUTO_INCREMENT,
  nome 							VARCHAR(100) NOT NULL,
  nome_cientifico  	VARCHAR(100),
  habitat          	VARCHAR(100),
  imagem_url       	VARCHAR(255)
);

CREATE TABLE post (
  id         			INT PRIMARY KEY AUTO_INCREMENT,
  autor_id   			INT NOT NULL,
  parent_id  			INT DEFAULT NULL,       
  titulo     			VARCHAR(255),          
  conteudo   			TEXT NOT NULL,
  criado_em  			DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_autor FOREIGN KEY (autor_id) REFERENCES usuario(id),
  CONSTRAINT fk_post_parent FOREIGN KEY (parent_id) REFERENCES post(id) 
);

SELECT * FROM post;

SELECT 
  p.id AS idAviso,
  p.titulo,
  p.conteudo,
  p.autor_id,
  p.criado_em,
  u.id AS idUsuario,
  u.nome
FROM post p
    JOIN usuario u
        ON p.autor_id = u.id;


SELECT
  c.id AS ID_COMENTARIO,
  c.conteudo AS CONTEUDO_COMENTARIO,
  p.id AS ID_POST_ORIGINAL,
  p.titulo AS TITULO_POST,
  p.conteudo AS CONTEUDO_POST,
  u.nome AS NOME_AUTOR_COMENTARIO
FROM post c
JOIN post p 
  ON c.parent_id = p.id
JOIN usuario u 
  ON c.autor_id = u.id;

SELECT * FROM usuario;

SELECT * FROM post;