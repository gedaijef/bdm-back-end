const express = require("express");
const router = express.Router();
const mensagemController = require("../controllers/mensagemController");

router.post("/SearchNews", mensagemController.selectNews);
router.post("/SearchNewsDetails", mensagemController.selectNewsDetail)

module.exports = router;