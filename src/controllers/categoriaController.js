const db = require("../config/db");

exports.listCategories = async (req, res) => {
    try {
      const result = await db.query(
        `
        SELECT * FROM default_category WHERE id not in(8,9) order by id 
        `
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao executar a query", error.stack);
      res.status(500).json({ error: "Erro no servidor", status: 500 });
    }
  };