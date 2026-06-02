const penguimModel = require("../models/penguimModel");

function listarTodosPenguins(req, res) {
  penguimModel.listarTodosPenguins()
    .then(function (resultado) {
      return res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os penguins: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  listarTodosPenguins
};