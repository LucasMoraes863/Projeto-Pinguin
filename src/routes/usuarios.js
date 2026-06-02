var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/register", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/auth", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/favorite/all", function (req, res) {
    usuarioController.buscarTodosFavoritos(req, res);
});

router.put("/favorite/:idUsuario", function (req, res) {
    usuarioController.atualizarFavorito(req, res);
});

router.get("/favorite/:idUsuario", function (req, res) {
    usuarioController.buscarFavoritoPorUsuario(req, res);
});

module.exports = router;