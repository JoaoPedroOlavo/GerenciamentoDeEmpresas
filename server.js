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
app.use(express.static('pagina_financeiro'))
app.use(express.static('public'))
app.use(express.static('pagina_logistica'))

function getDadosLogistica(companyName) {
    const query = "SELECT * FROM logistica WHERE id_empresa = (SELECT id FROM empresas WHERE nome_empresa = ?);";

    return new Promise((resolve, reject) => {
        db.query(query, [companyName], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getDadosFinanceiros(companyName) {
    const query = "SELECT * FROM transacoes WHERE id_empresa = (SELECT id FROM empresas WHERE nome_empresa = ?);";

    return new Promise((resolve, reject) => {
        db.query(query, [companyName], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


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

app.get('/financeiro_pagina', async (req, res) => {
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }

    try {
        // Aqui você pode chamar a função para obter dados financeiros
        // Vou chamar a função getDadosFinanceiros que iremos criar.
        const dadosFinanceiros = await getDadosFinanceiros(req.session.companyName);
        // Cálculos para totais
        console.log('Dados Financeiros:', dadosFinanceiros);
        console.log('Tipos de Transações:', dadosFinanceiros.map(transacao => transacao.tipo_transacao));

        const totalTransacoes = dadosFinanceiros.length;
        const transacoesCredito = dadosFinanceiros.filter(transacao => transacao.tipo_transacao === 'Credito');
        const transacoesDebito = dadosFinanceiros.filter(transacao => transacao.tipo_transacao === 'Debito');
        const transacoesDinheiro = dadosFinanceiros.filter(transacao => transacao.tipo_transacao === 'Dinheiro');
        const transacoesOutraForma = dadosFinanceiros.filter(transacao => transacao.tipo_transacao === 'Outra Forma');

        console.log('Transações de Crédito:', transacoesCredito);
        console.log('Transações de Débito:', transacoesDebito);
        console.log('Transações em Dinheiro:', transacoesDinheiro);
        console.log('Transações em Outra Forma:', transacoesOutraForma);

        const totalCredito = transacoesCredito.length;
        const totalDebito = transacoesDebito.length;
        const totalDinheiro = transacoesDinheiro.length;
        const totalOutraForma = transacoesOutraForma.length;

        // Calcular o total de transações no último dia
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        const transacoesUltimoDia = dadosFinanceiros.filter(transacao => {
            const dataTransacao = new Date(transacao.data_transacao);
            return dataTransacao >= ontem && dataTransacao < hoje;
        });

        console.log('Transações no Último Dia:', transacoesUltimoDia);

        const totalUltimoDia = transacoesUltimoDia.length;

        // Passar os totais para o template
        res.render('pagina_financeiro/pagina_financeiro', { companyName: req.session.companyName, dadosFinanceiros, totalTransacoes, totalCredito, totalDebito, totalDinheiro, totalOutraForma, totalUltimoDia });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter dados financeiros');
    }
});


app.get('/logistica_pagina', async (req, res) => {
    if (!req.session.companyName) {
        res.redirect('/login_pagina');
        return;
    }

    try {
        const dadosLogistica = await getDadosLogistica(req.session.companyName);
        res.render('pagina_logistica/pagina_logistica', { companyName: req.session.companyName, dadosLogistica });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter dados de logística');
    }
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
