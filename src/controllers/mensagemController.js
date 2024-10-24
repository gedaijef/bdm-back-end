const db = require("../config/db");
const { listCategories } = require("./categoriaController");

exports.selectNews = async (req, res) => {
  try {
    const { categoria, data } = req.body;

    if (!categoria || !data) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos", status: 400 });
    }

      result = await db.query(
        `
          select *, cm.codigo as codigo_conexao from mensagem m
          join categoria_mensagem cm on m.codigo = cm.mensagem_codigo  
          where cm.categoria_codigo = $1 and m."data" = $2
        `,
        [categoria, data]
      );

    res.json(result.rowCount);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};

exports.selectByCategory = async (req,res) => {
  try {
    const { categoria} = req.body;

    if (!categoria) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos", status: 400 });
    }
    
    const result = await db.query(
        `
          select *, cm.codigo as codigo_conexao from mensagem m
          join categoria_mensagem cm on m.codigo = cm.mensagem_codigo  
          where cm.categoria_codigo = $1
          `,
        [categoria]
      );
    
    res.json(result.rowCount);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}

exports.selectByDate = async (req,res) => {
  try {
    const { data} = req.body;

    if (!data) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos", status: 400 });
    }
    
      result = await db.query(
        `
          select *, cm.codigo as codigo_conexao from mensagem m
          join categoria_mensagem cm on m.codigo = cm.mensagem_codigo  
          where m."data" = $1
          `,
        [data]
      );
    
    res.json(result.rowCount);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}