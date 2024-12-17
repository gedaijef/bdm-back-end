const db = require("../config/db");
const { listCategories } = require("./categoriaController");

exports.selectNews = async (req, res) => {
  try {
    const { categoria, data_inicio, data_fim } = req.body;

    result = await db.query(
      `
          select count_group_message_by_date_category($1,$2,$3)
        `,
      [data_inicio, data_fim, categoria]
    );

    const countValue = result.rows[0]?.count_group_message_by_date_category;

    res.json(countValue);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};

exports.selectNewsDetail = async (req, res) => {
  try {
    const { categoria, data_inicio, data_fim } = req.body;

    result = await db.query(
    `
    SELECT content, distributed, id, time, date
    FROM get_group_messages_by_date_category(
    $1,  
    $2,  
    $3)
    ORDER BY date DESC, time DESC
    `,
      [data_inicio, data_fim, categoria]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};

exports.selectSpecificNews = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      `
    SELECT 
      gm.id,
      gm."content" ,
      gm.distributed ,
      gm."date",
      gm.time,
      STRING_AGG(dc."name" , ', ') AS categories
    FROM 
      group_message gm
    JOIN 
      default_category_group_message dcgm ON gm.id = dcgm.group_message_id
    JOIN 
      default_category dc ON dcgm.default_category_id = dc.id
    WHERE 
      gm.id = $1
    GROUP BY 
      gm.id, gm."content",gm.distributed;
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    return res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};
