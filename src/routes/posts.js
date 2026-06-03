var express = require("express");
var router = express.Router();

var postController = require("../controllers/postController");

router.get("/list", function (req, res) {
    postController.listar(req, res);
});

router.get("/list/:idUsuario", function (req, res) {
    postController.listarPorUsuario(req, res);
});

router.post("/publish/:idUsuario", function (req, res) {
    postController.publicar(req, res);
});

router.post("/comment/:idPost", function (req, res) {
    postController.publicarComentario(req, res);
});



module.exports = router;