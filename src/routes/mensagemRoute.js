const express = require("express");
const router = express.Router();
const mensagemController = require("../controllers/mensagemController");

router.post("/listNews", mensagemController.selectNews);

module.exports = router;
