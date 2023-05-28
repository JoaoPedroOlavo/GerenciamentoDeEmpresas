function inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha, res) {
    bcrypt.hash(senha, saltRounds, function (err, hash) {
        const query = "INSERT INTO empresas (nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha) VALUES (?, ?, ?, ?, ?);";
        db.query(query, [nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, hash], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/inicio_pagina')
            console.log("Empresa inserida com sucesso!");
        });
    });
}

function verificarLogin(email, senha, res) {
    const query = "SELECT * FROM empresas WHERE email_empresa = ?;";
    db.query(query, [email], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            bcrypt.compare(senha, results[0].senha, (err, result) => {
                if (result) {
                    console.log("Login bem-sucedido!");
                    res.redirect('/inicio_pagina');
                } else {
                    console.log("Senha incorreta!");
                    res.send('Senha incorreta!');
                }
            });
        } else {
            console.log("Email não encontrado!");
            res.send('Email não encontrado!');
        }
    });
}

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
app.use(express.static('pagina_login'));

// Rota para lidar com o cadastro do usuário
app.post('/cadastro', (req, res) => {
    // Obtém os dados do formulário
    const nome_empresa = req.body.nome_empresa;
    const cnpj_empresa = req.body.cnpj_empresa;
    const telefone_empresa = req.body.telefone_empresa;
    const email_empresa = req.body.email_empresa;
    const senha = req.body.senha;

    // Insere os dados na tabela users
    inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha, res);
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const senha = req.body.password;
    verificarLogin(email, senha, res);
});

// Rota para servir a página de cadastro
app.get('/cadastro_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_cadastro/signup_page.html');
});

// Rota para servir a página de inicio
app.get('/inicio_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_inicial/initial_page.html');
});

// Rota para servir a página de login
app.get('/login_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_login/login_page.html');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});