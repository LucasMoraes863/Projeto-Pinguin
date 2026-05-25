var database = require("../database/config");

function listarPerguntasRespostas() {
    console.log("ACESSEI A PERGUNTA MODEL - function listarPerguntasRespostas()");
    var instrucaoSql = `
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
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
  listarPerguntasRespostas
};