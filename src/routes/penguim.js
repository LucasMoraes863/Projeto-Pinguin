var express = require("express");
var router = express.Router();

var penguimController = require("../controllers/penguimController");

router.get("/get-all", function (req, res) {
  penguimController.listarTodosPenguins(req, res);
});

module.exports = router;
