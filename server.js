// Importando módulos necessários
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

// Configuração inicial
const saltRounds = 10;
const app = express();

// Configuração da sessão
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Joao1310',
    database: 'empresas'
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

// Configuração do template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/'));

// Middleware para análise de solicitações POST
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static('pagina_cadastro'));
app.use(express.static('pagina_inicial'));
app.use(express.static('pagina_login'));
app.use(express.static('pagina_principal'));
app.use(express.static('pagina_perfil'))

// Funções para manipular o banco de dados
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

function verificarLogin(email, senha, req, res) {
    const query = "SELECT * FROM empresas WHERE email_empresa = ?;";
    db.query(query, [email], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            bcrypt.compare(senha, results[0].senha, (err, result) => {
                if (result) {
                    console.log("Login bem-sucedido!");
                    // Store the company name in the session
                    req.session.companyName = results[0].nome_empresa;
                    res.redirect('/principal_pagina');
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

// Rotas
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
    verificarLogin(email, senha, req, res);
});

// Rota para página de cadastro
app.get('/cadastro_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_cadastro/signup_page.html');
});

// Rota para página inicial
app.get('/inicio_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_inicial/initial_page.html');
});

// Rota para página de login
app.get('/login_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_login/login_page.html');
});

// Rota para página principal
app.get('/principal_pagina', (req, res) => {
    res.render('pagina_principal/pagina_principal', { companyName: req.session.companyName });
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/login_pagina');
    });
});

// Rota para a página de perfil
app.get('/perfil_pagina', (req, res) => {
    // Verifique se o usuário está logado
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }

    // Consulte o banco de dados para obter os detalhes do perfil da empresa
    const companyName = req.session.companyName;
    const query = "SELECT * FROM empresas WHERE nome_empresa = ?;";
    db.query(query, [companyName], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            const companyDetails = results[0]; // Detalhes da empresa

            // Renderize a página de perfil na pasta 'pagina_perfil' e passe os detalhes da empresa para a página
            res.render('pagina_perfil/pagina_perfil', { companyDetails });
        } else {
            console.log("Empresa não encontrada!");
            res.send('Empresa não encontrada!');
        }
    });
});



// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
