var express = require("express");
var router = express.Router();

var perguntaController = require("../controllers/perguntaController");

router.get("/questions-answers", function (req, res) {
  perguntaController.listarPerguntasRespostas(req, res);
});

module.exports = router;
