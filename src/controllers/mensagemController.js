const db = require("../config/db");
const { listCategories } = require("./categoriaController");

exports.selectNews = async (req, res) => {
  try {
    const { categorias, ordem } = req.body;

    // Verificação dos campos obrigatórios
    if (!categorias || !ordem) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos", status: 400 });
    }

    async function verificaCategoria(categorias) {
      if (categorias.length) {
        const result = await db.query(
            `
            select * from categoria_mensagem cm where categoria_codigo in ($1)
            `,
            [categorias]
          );
          let filtrado = result.rows.length > 0;
        return filtrado
      }
      const categoriesString = listCategories().map(row => row.nome).join(",");
      const result = await db.query(
        `
        select * from categoria_mensagem cm where categoria_codigo in ($1)
        `,
        [categoriesString]
      );
      return result.rows.length>0
    }

    async function verificarOrdem(ordem) {
      if ((ordem = "")) {
        ordem = "DESC";
      }
      return ordem;
    }

    /////////////////////////////////////////////////////////////////////

    let returnFiltro = verificaCategoria(categorias);
    let returnOrdem = verificarOrdem(ordem)
    await db.query(`
        SELECT * FROM mensagem m 
        WHERE codigo IN ($1) 
        ORDER BY hora $2
        `, [returnFiltro,ordem]);

    res
      .status(201)
      .json({ message: "Usuário adicionado com sucesso", status: 201 });
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};
