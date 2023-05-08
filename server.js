function inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha, res) {
    const query = "INSERT INTO empresas (nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha) VALUES (?, ?, ?, ?, ?);";
    db.query(query, [nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha], (err, result) => {
        if (err) {
            throw err;
        }
        res.redirect('/inicio_pagina')
        console.log("Empresa inserida com sucesso!");
    });
}

const express = require('express');
const mysql = require('mysql');
const app = express();

// Configuração do banco de dados
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'joao',
    password: 'root',
    database: 'empresa'
});

// Conexão com o banco de dados
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados');
});

// Middleware para analisar os dados do formulário
app.use(express.urlencoded({ extended: true }));
// Middleware para carregar css da pagina
app.use(express.static('pagina_cadastro'));
app.use(express.static('pagina_inicial'));

// Rota para lidar com o cadastro do usuário
app.post('/cadastro', (req, res) => {
    // Obtém os dados do formulário
    const nome_empresa = req.body.nome_empresa;
    const cnpj_empresa = req.body.cnpj_empresa;
    const telefone_empresa = req.body.telefone_empresa;
    const email_empresa = req.body.email_empresa;
    const senha = req.body.senha;

    // Insere os dados na tabela users
    inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa,senha, res);
});

// Rota para servir a página de cadastro
app.get('/cadastro_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_cadastro/signup_page.html');
});

// Rota para servir a página de inicio
app.get('/inicio_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_inicial/initial_page.html');
});


// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});