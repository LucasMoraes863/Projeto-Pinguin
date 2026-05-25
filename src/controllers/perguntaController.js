var perguntaModel = require("../models/perguntaModel");

function listarPerguntasRespostas(req, res) {
  perguntaModel.listarPerguntasRespostas()
    .then(function (resultado) {
      return res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar as perguntas: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  listarPerguntasRespostas
};