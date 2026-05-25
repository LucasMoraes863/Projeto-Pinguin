CREATE DATABASE pengu;
USE pengu;

DROP DATABASE pengu;

TRUNCATE TABLE post;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50) UNIQUE,
	senha VARCHAR(50),
  especie_favorita_id INT,
	CONSTRAINT fk_usuario_especie FOREIGN KEY (especie_favorita_id) REFERENCES especie(id)
);

CREATE TABLE especie (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(100),
  habitat VARCHAR(100),
  imagem_url VARCHAR(255)
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
  categoria VARCHAR(100) NOT NULL,
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
  total_perguntas INT NOT NULL,
  tempo_segundos INT NOT NULL DEFAULT 0,
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



-- inserts

INSERT INTO pergunta_trivia (categoria, dificuldade, texto) VALUES
('Voo',           'facil',   'Os pinguins já foram capazes de voar em algum momento da história evolutiva?'),
('Tamanho',       'facil',   'Qual é a maior espécie de pinguim do mundo?'),
('Habitat',       'facil',   'Os pinguins vivem exclusivamente no Pólo Sul, na Antártica?'),
('Alimentação',   'facil',   'Qual é a principal fonte de alimentação dos pinguins na natureza?'),
('Menor espécie', 'medio',   'Qual é a menor espécie de pinguim e onde ela vive?'),
('Comportamento', 'medio',   'O que os pinguins-de-adélia fazem para construir o ninho?'),
('Nomenclatura',  'medio',   'Por que o pinguim-macaroni tem esse nome incomum?'),
('Ameaça',        'medio',   'Por que o pinguim-de-olho-amarelo é considerado uma das aves mais ameaçadas do mundo?'),
('Evolução',      'dificil', 'Qual foi o pinguim pré-histórico mais alto já descoberto pela ciência?'),
('Fisiologia',    'dificil', 'Durante a incubação no inverno antártico, como o pinguim-imperador macho sobrevive sem comer?'),
('Migração',      'dificil', 'O pinguim-de-magalhães realiza migrações sazonais. Para onde e por quê?'),
('Mergulho',      'dificil', 'Qual espécie de pinguim detém o recorde de profundidade de mergulho?');

INSERT INTO resposta_trivia (texto, correta, explicacao, fk_pergunta) VALUES
('Sim, voavam há cerca de 65 milhões de anos.',1,'Os ancestrais dos pinguins eram aves voadoras. Há ~65 Ma especializaram-se em mergulho e as asas evoluíram para nadadeiras.',1),
('Sim, voavam até o período glacial, quando perderam essa capacidade.',0,NULL,1),
('Não — nunca tiveram capacidade de voo.',0,NULL,1),
('Sim, alguns ainda conseguem planar por curtas distâncias.',0,NULL,1),

('Pinguim-de-magalhães',0,NULL,2),
('Pinguim-macaroni',0,NULL,2),
('Pinguim-imperador',1,'O pinguim-imperador chega a 1,2 m e 40 kg. É o único que incuba ovos no inverno antártico, a −60°C.',2),
('Pinguim-rei',0,NULL,2),

('Sim, todos os pinguins só vivem na Antártica.',0,NULL,3),
('Não — muitas espécies vivem em climas temperados e até tropicais.',1,'O pinguim-de-galápagos vive quase no Equador. O pinguim-pequeno vive na Austrália. O pinguim-de-magalhães vive na Patagônia.',3),
('Sim, mas algumas migram para a América do Sul no verão.',0,NULL,3),
('Não — pinguins existem também no Ártico.',0,NULL,3),

('Algas e vegetais marinhos.',0,NULL,4),
('Camarões, lulas e peixes.',1,'Pinguins são carnívoros marinhos. Dieta varia por espécie mas inclui peixes, lulas e krill. O imperador pode chegar a 500 m de profundidade.',4),
('Medusas e plâncton.',0,NULL,4),
('Krill e larvas de insetos aquáticos.',0,NULL,4),

('Pinguim-de-adélia — Antártica.',0,NULL,5),
('Pinguim-pequeno — Austrália e Nova Zelândia.',1,'O pinguim-pequeno (Eudyptula minor) mede só 30-40 cm. Emerge das tocas apenas à noite para evitar predadores.',5),
('Pinguim-macaroni — Ilhas Malvinas.',0,NULL,5),
('Pinguim-de-olho-amarelo — Nova Zelândia.',0,NULL,5),

('Usam galhos e folhas coletados no litoral.',0,NULL,6),
('Escavam tocas no solo gelado.',0,NULL,6),
('Empilham pedras cuidadosamente escolhidas.',1,'Os pinguins-de-adélia constroem ninhos de pedras para evitar que os ovos se molhem. Machos chegam a roubar pedras de ninhos vizinhos.',6),
('Não constroem ninho — chocam ovos em pé, como o imperador.',0,NULL,6),

('Foi descoberto por exploradores italianos que lembraram a massa.',0,NULL,7),
('O nome vem de um estilo de moda extravagante do século XVIII na Inglaterra.',1,'No século XVIII "macaroni" era gíria britânica para homens de trajes exagerados. O topete amarelo vistoso da espécie inspirou a comparação.',7),
('Foi batizado em homenagem a um navio da expedição.',0,NULL,7),
('Deve-se à coloração amarela das penas, semelhante ao milho.',0,NULL,7),

('Pelas mudanças climáticas que aquecem o mar da Antártica.',0,NULL,8),
('Pela caça histórica intensa para extração de óleo.',0,NULL,8),
('Por ter população minúscula e sofrer com predadores introduzidos e perda de habitat.',1,'O hoiho vive só na Nova Zelândia. Restam menos de 4.000 indivíduos. Ameaçado por predadores introduzidos (furões, gatos) e desmatamento.',8),
('Pela baixa taxa de reprodução — coloca apenas 1 ovo por ciclo.',0,NULL,8)
,
('Anthropornis nordenskjoeldi — cerca de 1,8 m.',0,NULL,9),
('Icadyptes salasi — cerca de 1,5 m.',0,NULL,9),
('Palaeeudyptes klekowskii — estimado em 2,0 m.',1,'O Palaeeudyptes klekowskii viveu há ~37 Ma. Estimativas indicam até 2,0 m e 115 kg. Fósseis encontrados na Ilha Seymour, Antártica.',9),
('Waimanu manneringi — cerca de 1,6 m.',0,NULL,9),

('Alimenta o filhote com secreção do esôfago semelhante ao leite.',0,NULL,10),
('Entra em torpor metabólico, reduzindo o metabolismo em 90%.',0,NULL,10),
('Vive exclusivamente das reservas de gordura acumuladas no outono.',1,'O macho fica 2-3 meses sem comer, sustentado por gordura de até 40% do peso. Agrupam-se em colônias para conservar calor.',10),
('Faz turnos com outros machos, indo ao mar pescar.',0,NULL,10),

('Migra para a Antártica no inverno para se reproduzir.',0,NULL,11),
('Migra para águas brasileiras no inverno austral em busca de alimento.',1,'No inverno austral (mai-ago), o pinguim-de-magalhães nada até o Brasil em busca de anchovas e sardinhas. Alguns chegam ao Espírito Santo.',11),
('Migra para a África do Sul seguindo correntes de krill.',0,NULL,11),
('Não migra — permanece na Patagônia o ano inteiro.',0,NULL,11),

('Pinguim-rei — 343 m.',0,NULL,12),
('Pinguim-imperador — 564 m.',1,'O pinguim-imperador detém o recorde: até 564 m de profundidade e 22 min de duração. Coração desacelera a < 10 bpm.',12),
('Pinguim-de-adélia — 170 m.',0,NULL,12),
('Pinguim-de-magalhães — 91 m.',0,NULL,12);


INSERT INTO usuario (nome, email, senha) VALUES
('sosa',  'sosa@email.com',  '12345678'),
('pengu',    'pengu@email.com',    '12345678'),
('Rafael', 'rafael@email.com', '12345678');