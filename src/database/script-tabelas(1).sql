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






-- TODO: CRIAR AS VIEWS DA DASH

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
  ON c.autor_id = u.id
WHERE p.id = 3;

SELECT * FROM usuario;

SELECT * FROM post;

SELECT COUNT(*) AS total_posts 
FROM post 
WHERE autor_id = 1;


SELECT
  p.id AS id_pergunta,
  p.dificuldade,
  p.texto AS pergunta,
  r.id AS id_resposta,
  r.texto AS resposta,
  r.explicacao
FROM pergunta p
JOIN resposta r
ON r.fk_pergunta = p.id
ORDER BY p.id;

TRUNCATE TABLE post;
truncate table especie;

 SELECT
            realizado_em AS data_tentativa,
            pontuacao,
            tempo_segundos AS tempo
        FROM tentativa 
        WHERE fk_usuario = 1
        ORDER BY data_tentativa;

SET FOREIGN_KEY_CHECKS = 0; -- Turn off checks
use pengu;
truncate table especie;

INSERT INTO especie (nome, nome_cientifico, habitat, descricao, imagem_url) VALUES
('Pinguim-imperador',       'Aptenodytes forsteri',     'Antártica',                         'O maior de todos os pinguins. Lidera com calma e resistência. Enfrenta os piores invernos sem reclamar — e sai vitorioso.',         '../../images/home-images/pinguin-imperador.jpg'),
('Pinguim-de-magalhães',    'Spheniscus magellanicus',  'Patagônia e costa brasileira',      'Aventureiro e sociável. Faz longas jornadas em busca de novas experiências — e sempre volta para quem ama.',                       '../../images/home-images/pinguin-magal.jpg'),
('Pinguim-pequeno',         'Eudyptula minor',          'Austrália e Nova Zelândia',         'O menor e mais encantador. Discreto mas surpreende a todos com inteligência e agilidade.',                                          '../../images/home-images/pinguin-azul.jpg'),
('Pinguim-de-adélia',       'Pygoscelis adeliae',       'Antártica',                         'Direto ao ponto e cheio de energia. Não tem medo de defender seu espaço — e faz isso com muito charme.',                           '../../images/home-images/pinguin-adelia.jpg'),
('Pinguim-de-olho-amarelo', 'Megadyptes antipodes',     'Nova Zelândia',                     'Raro e reflexivo. Prefere profundidade a superficialidade. As conexões que cultiva são para a vida toda.',                         '../../images/home-images/pinguin-olho-amarelo.jpg'),
('Pinguim-macaroni',        'Eudyptes chrysolophus',    'Subantártica e Península Antártica','Extravagante e cheio de personalidade! Não passa despercebido — e usa isso a seu favor em tudo que faz.',                         '../../images/home-images/pinguin-macaroni.jpg');

  truncate table resposta;

INSERT INTO pergunta (id, dificuldade, texto) VALUES 
(1, 'medio', 'Qual espécie de pinguim é considerada a mais veloz dentro d''água, atingindo até 36 km/h?'),
(2, 'facil', 'O que os machos de algumas espécies de pinguins costumam usar para presentear as fêmeas durante o cortejo?'),
(3, 'dificil', 'Como funciona o recurso de camuflagem dos pinguins conhecido como "contra-sombreado"?'),
(4, 'medio', 'Por que a pele dos pinguins se mantém seca mesmo durante mergulhos extremamente profundos?'),
(5, 'medio', 'Qual é o fator que permite a sobrevivência do pinguim-de-galápagos em plena linha do Equador?'),
(6, 'facil', 'Em colônias com milhares de indivíduos, como pais e filhotes de pinguins conseguem se encontrar?'),
(7, 'dificil', 'O que os registros fósseis indicam sobre o processo evolutivo e os ancestrais dos pinguins?');

INSERT INTO resposta (texto, correta, explicacao, fk_pergunta) VALUES
('Pinguim-imperador', 0, NULL, 1),
('Pinguim-gentoo', 1, 'Suas asas-nadadeiras batem com a mesma frequência e potência de outros pássaros em voo, mas em meio líquido.', 1),
('Pinguim-de-galápagos', 0, NULL, 1),
('Pinguim-azul', 0, NULL, 1),
('Peixes coloridos', 0, NULL, 2),
('Conchas do mar', 0, NULL, 2),
('Pedras polidas', 1, 'Muitas espécies são monogâmicas e casais podem permanecer juntos por mais de 10 anos consecutivos.', 2),
('Pedaços de gelo', 0, NULL, 2),
('O dorso preto se mistura com o fundo do mar e o ventre branco com a claridade da superfície', 1, 'Visto de cima, o dorso preto se mistura à escuridão. Visto de baixo, o ventre branco se confunde com a luz, enganando predadores.', 3),
('Eles mudam a cor das penas de acordo com a temperatura da água', 0, NULL, 3),
('Eles soltam uma tinta escura na água para despistar predadores', 0, NULL, 3),
('Suas penas refletem o ambiente ao redor como um espelho', 0, NULL, 3),
('Por causa de uma espessa camada de escamas por baixo das penas', 0, NULL, 4),
('Porque eles não mergulham fundo o suficiente para a água penetrar', 0, NULL, 4),
('Devido a uma camada de ar que eles aprisionam nos pulmões', 0, NULL, 4),
('Devido a um óleo especial espalhado em sua densa plumagem', 1, 'Eles possuem a maior densidade de penas do mundo e esse óleo as torna 100% impermeáveis.', 4),
('A capacidade de transpirar através de glândulas nas patas', 0, NULL, 5),
('Eles vivem apenas no topo das montanhas nevadas da ilha', 0, NULL, 5),
('A presença da corrente fria de Humboldt', 1, 'A corrente fria de Humboldt torna o ambiente habitável. Existem populações também na África do Sul, Austrália, Peru e Argentina.', 5),
('A migração obrigatória para a Antártida durante o verão', 0, NULL, 5),
('Pelas manchas específicas e exclusivas na barriga', 0, NULL, 6),
('Através de um chamado vocal único e individual', 1, 'Cada pinguim possui uma "impressão digital sonora" precisa o suficiente para encontrar a família no meio da multidão.', 6),
('Através do cheiro corporal exclusivo', 0, NULL, 6),
('Por meio de danças coreografadas em família', 0, NULL, 6),
('Voavam grandes distâncias sobre os oceanos e eram do tamanho de um pardal', 0, NULL, 7),
('Ainda não perderam totalmente a capacidade de voar em correntes de vento', 0, NULL, 7),
('Perderam a capacidade de voo muito cedo e os primeiros tinham quase o tamanho de um humano', 1, 'O pinguim-imperador ainda carrega traços desse passado imponente.', 7),
('Eram pequenos mamíferos aquáticos antes de evoluírem para o formato de ave', 0, NULL, 7);


SELECT * from tentativa;

SELECT * FROM usuario;