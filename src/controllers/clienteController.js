const { response } = require("express");
const db = require("../config/db");
const { exec } = require("child_process");
const { log } = require("console");

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
  return result.rows.length > 0
}

async function lengthTelefone(telefone){
  let phoneStr = telefone.toString()
  if (phoneStr.charAt(4) !== '9' || phoneStr.length !== 13) {
    return false
  }return true
}

async function verificarEmail(email){
  if(email.includes('@') && email.includes('.com')){
    return true
  }return false
}

exports.login = async (req,res) =>{
  try{
    const {password} = req.body

    if(!password){
      return res.status(400).json({error:"Insira a senha para acessar o site" , status: 400})
    }  
    if(password === process.env.SENHA_ADMIN){
      res.status(202).json({ message: "Senha correta", status: 201});
    }else{
      res.status(401).json({ error: "Senha incorreta", status: 401});
    }
  }catch (error) {
    console.error("Erro ao verificar senha", error.stack);
    res.status(500).json({ error: "Erro no servidor", status: 500 });
  }
}

exports.insertCliente = async (req, res) => {
  try {
    let {
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
    if (!(await lengthTelefone(telefone))){
      phoneStr = telefone.toString()
      phoneStr = phoneStr.slice(0, 3) + "9" + phoneStr.slice(3)
      if (!(await lengthTelefone(phoneStr))){
        return res.status(400).json({error: "Telefone incorreto", status:400 })
      }
    }
    if (!(await verificarEmail(email))){
      return res.status(400).json({error:"Email inválido",status:400 })
    }

    const categoriasArray = categorias.split(',').map(Number);

    const categoriasConcat = await db.query(
      `SELECT string_agg(name, ', ') AS nomes_concatenados 
      FROM default_category 
      WHERE id = ANY($1);`,
    [categoriasArray]
    );
    
    exec(
      `python3 Mandar_mensagem.py "${nome}" "${telefone}" "${categoriasConcat+" e Serviços"}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao executar o script: ${error.message}`);
          return res.status(500).json({ error: "Erro ao executar script", status: 500 });
        }
        if (stderr) {
          console.error(`Erro no script: ${stderr}`);
          return res.status(500).json({ error: "Erro no script Python", status: 500 });
        }
      }
    );

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
      `
       SELECT c.name, c.phone_number, c.email, c.cpf, c.birth_date, c.company, c.position, STRING_AGG(dc.name, ', ') AS concat_categories
       FROM default_category dc
       join default_category_client dcc on dc.id = dcc.default_category_id
       join client c on c.id = dcc.client_id
       where dcc.client_id = c.id
       group by 1,2,3,4,5,6,7, c.id
      `
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