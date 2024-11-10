const db = require("../config/db");

async function verificarData(data_nascimento){
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) {
    return false;
  }

  const data = new Date(data_nascimento);

  if (isNaN(data.getTime())) {
    return false;
  }

  const [ano, mes, dia] = data_nascimento.split('-').map(Number);
  return (
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() + 1 === mes &&
    data.getUTCDate() === dia
  );
}

async function verificarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.charAt(10));
}

async function verificarTelefone(telefone) {
  const result = await db.query(
    `
    SELECT phone_number FROM client
    WHERE phone_number = $1
    `,
    [telefone]
  );
  return result.rows.length > 0;
}

exports.insertCliente = async (req, res) => {
  try {
    const {
      nome,
      telefone,
      profissao,
      email,
      cpf,
      categorias,
      empresa,
      data_nascimento,
    } = req.body;

    if (
      !nome ||
      !telefone ||
      !profissao ||
      !email ||
      !cpf ||
      !categorias ||
      !empresa ||
      !data_nascimento
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos", status: 400 });
    }

    if (!(await verificarCPF(cpf))) {
      return res.status(400).json({ error: "CPF inválido", status: 409 });
    }
    if (!(await verificarData(data_nascimento))) {
      return res.status(400).json({ error: "Data de nascimento inválida", status: 409 });
    }
    if (await verificarTelefone(telefone)) {
      return res
        .status(409)
        .json({ error: "Telefone já cadastrado", status: 409 });
    }
    await db.query(`CALL insert_new_client($1, $2, $3, $4, $5, $6, $7, $8)`, [
      cpf,
      telefone,
      email,
      categorias,
      nome,
      data_nascimento,
      empresa,
      profissao,
    ]);

    res.status(201).json({ message: "Usuário adicionado com sucesso", status: 201});
  } catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
};

exports.deleteCliente = async (req,res) =>{
  try{
    const {phone} = req.body

    if(!phone){
      return res.status(400).json({error:"Todos os campos devem ser preenchidos" , status: 400})
    }  

    if(await !verificarTelefone(phone)){
      return res
        .status(404)
        .json({ error: "Número não encontrado", status: 404 });
    }
    await db.query(
      `CALL delete_client_by_phone_number($1)`,
      [phone]
    );

    res.status(201).json({ message: "Telefone deletado com sucesso", status: 201});
  }catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}

exports.searchCliente = async (req,res) =>{
  try{

    const result = await db.query(
      `SELECT name, phone_number, email, cpf, birth_date, company, position FROM client ORDER BY name`
    );
    
    res.json(result.rows);
  }catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}

exports.searchClientebyPhone = async (req,res) =>{
  try{
    const {phone} = req.body

    if(!phone){
      return res.status(400).json({error:"Todos os campos devem ser preenchidos" , status: 400})
    }

    const result = await db.query(
      `SELECT name, phone_number, email, cpf FROM client WHERE phone_number = $1`,
      [phone]
    );
    
    res.json(result.rows);
  }catch (error) {
    console.error("Erro ao executar a query", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}