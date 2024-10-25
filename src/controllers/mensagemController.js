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
          select * from group_message gm 
          join default_category_group_message dcgm on gm.id = dcgm.group_message_id 
          where dcgm.default_category_id = $1 and gm."date" = $2
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
          select * from group_message gm 
          join default_category_group_message dcgm on gm.id = dcgm.group_message_id 
          where dcgm.default_category_id = $1
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
          select * from group_message gm 
          join default_category_group_message dcgm on gm.id = dcgm.group_message_id 
          where gm."date" = $1
          `,
        [data]
      );
    
    res.json(result.rowCount);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}