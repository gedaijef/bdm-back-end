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

exports.selectNewsDetail = async (req, res)=> {
  try{
    const { categoria, data_inicio, data_fim } = req.body;

    result = await db.query(
    `SELECT content, distributed
    FROM get_group_messages_by_date_category(
    $1,  
    $2,  
    $3)  
    `,[data_inicio,data_fim,categoria]);

    res.json(result.rows);
  }catch (error){
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}