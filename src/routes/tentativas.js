var express = require("express");
var router = express.Router();

var tentativaController = require("../controllers/tentativaController");

router.get("/", (_req, res) => {
  tentativaController.listarTentativas(_req, res);
});

router.get("/ranking", (_req, res) => {
  tentativaController.listarRanking(_req, res);
});

router.get("/best", (_req, res) => {
  tentativaController.listarMelhorUsuario(_req, res);
});

router.get("/usuario/:idUsuario", (req, res) => {
  tentativaController.listarTentativasUsuario(req, res);
});

router.post("/postar", (req, res) => {
  tentativaController.salvarTentativa(req, res);
});

module.exports = router;