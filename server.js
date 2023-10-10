const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const saltRounds = 10;
const app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Joao1310',
    database: 'empresas'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('pagina_cadastro'));
app.use(express.static('pagina_inicial'));
app.use(express.static('pagina_login'));
app.use(express.static('pagina_principal'));
app.use(express.static('pagina_perfil'));
app.use(express.static('pagina_rh'));

function inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha, res) {
    bcrypt.hash(senha, saltRounds, function (err, hash) {
        const query = "INSERT INTO empresas (nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha) VALUES (?, ?, ?, ?, ?);";
        db.query(query, [nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, hash], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/inicio_pagina');
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

app.post('/cadastro', (req, res) => {
    const nome_empresa = req.body.nome_empresa;
    const cnpj_empresa = req.body.cnpj_empresa;
    const telefone_empresa = req.body.telefone_empresa;
    const email_empresa = req.body.email_empresa;
    const senha = req.body.senha;

    inserirEmpresa(nome_empresa, cnpj_empresa, telefone_empresa, email_empresa, senha, res);
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const senha = req.body.password;
    verificarLogin(email, senha, req, res);
});

app.get('/cadastro_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_cadastro/signup_page.html');
});

app.get('/inicio_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_inicial/initial_page.html');
});

app.get('/login_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_login/login_page.html');
});

app.get('/rh_pagina', (req, res) => {
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }

    const companyName = req.session.companyName;
    const query = "SELECT * FROM funcionario WHERE id_empresa = (SELECT id FROM empresas WHERE nome_empresa = ?);";
    db.query(query, [companyName], (err, results) => {
        if (err) {
            throw err;
        }

        res.render('pagina_rh/pagina_rh', { funcionarios: results, companyName: companyName });
    });
});

app.get('/financeiro_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_financeiro/pagina_financeiro.html');
});

app.get('/logistica_pagina', (req, res) => {
    res.sendFile(__dirname + '/pagina_logistica/pagina_logistica.html');
});

app.get('/principal_pagina', (req, res) => {
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }
    res.render('pagina_principal/pagina_principal', { companyName: req.session.companyName });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/login_pagina');
    });
});

app.get('/perfil_pagina', (req, res) => {
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }

    const companyName = req.session.companyName;
    const query = "SELECT * FROM empresas WHERE nome_empresa = ?;";
    db.query(query, [companyName], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            const companyDetails = results[0];
            res.render('pagina_perfil/pagina_perfil', { companyDetails });
        } else {
            console.log("Empresa não encontrada!");
            res.send('Empresa não encontrada!');
        }
    });
});

app.delete('/demitir_funcionario/:id', (req, res) => {
    const funcionarioId = req.params.id; // Use 'id' em vez de 'id_funcionario'

    const query = "DELETE FROM funcionario WHERE id_funcionario = ?;";
    db.query(query, [funcionarioId], (err, result) => {
        if (err) {
            throw err;
        }
        console.log("Funcionário demitido com sucesso!");
        res.redirect('/rh_pagina');
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
