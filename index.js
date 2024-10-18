const express = require("express");
const cors = require("cors");
const clienteRoute = require("./src/routes/clienteRoute");
const categoriaRoute = require("./src/routes/categoriaRoute");
const mensagemRoute = require("./src/routes/mensagemRoute")

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/client", clienteRoute);
app.use("/categorie", categoriaRoute);
app.use("/news",mensagemRoute);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
