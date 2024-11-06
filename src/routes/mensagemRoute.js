const express = require("express");
const router = express.Router();
const mensagemController = require("../controllers/mensagemController");

router.post("/SearchNews", mensagemController.selectNews);

module.exports = router;