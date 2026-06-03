CREATE DATABASE pengu;
USE pengu;

CREATE TABLE especie (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(100),
  habitat VARCHAR(100),
  descricao TEXT,
  imagem_url VARCHAR(255)
);

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50) UNIQUE,
	senha VARCHAR(50),
  especie_favorita_id INT,
	CONSTRAINT fk_usuario_especie FOREIGN KEY (especie_favorita_id) REFERENCES especie(id)
);


CREATE TABLE post (
  id INT PRIMARY KEY AUTO_INCREMENT,
  autor_id INT NOT NULL,
  parent_id INT DEFAULT NULL,       
  titulo VARCHAR(255),          
  conteudo TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_autor FOREIGN KEY (autor_id) REFERENCES usuario(id),
  CONSTRAINT fk_post_parent FOREIGN KEY (parent_id) REFERENCES post(id) 
);

CREATE TABLE pergunta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dificuldade VARCHAR(10) NOT NULL DEFAULT 'facil',
  texto TEXT NOT NULL,
  CONSTRAINT chk_dificuldade CHECK (dificuldade IN ('facil', 'medio', 'dificil'))
);
CREATE TABLE resposta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT NOT NULL,
  correta TINYINT(1) NOT NULL DEFAULT 0,
  explicacao TEXT,
  fk_pergunta INT NOT NULL,
  CONSTRAINT fk_rt_pergunta FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id)
);


CREATE TABLE tentativa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pontuacao INT NOT NULL,
  realizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  fk_usuario INT NOT NULL,
  CONSTRAINT fk_tt_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);
