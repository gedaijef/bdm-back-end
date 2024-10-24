const express = require("express");
const router = express.Router();
const mensagemController = require("../controllers/mensagemController");

router.post("/SearchNews", mensagemController.selectNews);
router.post("/SearchByCategory", mensagemController.selectByCategory)
router.post("/SelectByDate",mensagemController.selectByDate)

module.exports = router;