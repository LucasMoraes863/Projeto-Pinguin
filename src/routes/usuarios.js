var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/register", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/auth", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;