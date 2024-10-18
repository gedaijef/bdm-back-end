const db = require("../config/db");

exports.insertCliente = async (req, res) => {
  try {
    const { nome, telefone, profissao, email, cpf, categorias } = req.body;

    // Verificação dos campos obrigatórios
    if (!nome || !telefone || !profissao || !email || !cpf || !categorias) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" , status: 400});
    }

    async function verificarCPF(cpf) {
      const result = await db.query(
        `
        SELECT cpf FROM cliente
        WHERE cpf = $1
        `,
        [cpf]
      );
      return result.rows.length > 0;
    }

    async function verificarTelefone(telefone) {
      const result = await db.query(
        `
        SELECT numero FROM cliente
        WHERE numero = $1
        `,
        [telefone]
      );
      return result.rows.length > 0;
    }

/////////////////////////////////////////////////////////////////////

    if (await verificarCPF(cpf)) {
      return res
        .status(409)
        .json({ error: "CPF já cadastrado", status: 409 });
    }
    if (await verificarTelefone(telefone)) {
      return res
        .status(409)
        .json({ error: "Telefone já cadastrado", status: 409 });
    }
    await db.query(
      `CALL inserir_novo_cliente($1, $2, $3, $4, $5, $6)`,
      [telefone, nome, profissao, cpf, email, categorias]
    );

    res.status(201).json({ message: "Usuário adicionado com sucesso", status: 201});
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};

exports.deleteCliente = async (req,res) =>{
  try{
    const {cpf} = req.body

    if(!cpf){
      return res.status(400).json({error:"Todos os campos devem ser preenchidos" , status: 400})
    }
    
    async function verificarCPF(cpf){
      const result = await db.query(
        `
        SELECT * FROM cliente
        WHERE cpf = $1
        `,
        [cpf]
      );
      return result.rows.length > 0;
    }

    if(await !verificarCPF(cpf)){
      return res
        .status(404)
        .json({ error: "CPF não encontrado", status: 404 });
    }
    await db.query(
      `CALL deletar_cliente_cpf($1)`,
      [cpf]
    );

    res.status(201).json({ message: "Usuário deletado com sucesso", status: 201});
  }catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}

exports.searchCliente = async (req,res) =>{
  try{
    const {cpf} = req.body

    if(!cpf){
      return res.status(400).json({error:"Todos os campos devem ser preenchidos" , status: 400})
    }

    const result = await db.query(
      `SELECT nome, numero, email, cpf FROM cliente WHERE cpf = $1`,
      [cpf]
    );
    
    res.json(result.rows);
  }catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}