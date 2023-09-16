CREATE DATABASE empresas;

CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj_empresa VARCHAR(18) UNIQUE NOT NULL,
    telefone_empresa VARCHAR(15),
    email_empresa VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL
);

SELECT * FROM empresas;

-- Tabela de Transações
CREATE TABLE transacoes (
    id_transacao INT PRIMARY KEY,
    data_transacao DATETIME,
    tipo_transacao VARCHAR(50),
    valor_transacao DECIMAL(10, 2),
    descricao_transacao TEXT,
    id_empresa INT,
    local_transacao VARCHAR(100),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
);

-- Tabela de Funcionário
CREATE TABLE funcionario (
    id_funcionario INT PRIMARY KEY,
    data_admissao DATETIME,
    nome VARCHAR(100),
    idade INT,
    setor VARCHAR(50),
    id_empresa INT,
    email_funcionario VARCHAR(100),
    cpf VARCHAR(14),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
);

-- Tabela de Logística
CREATE TABLE logistica (
    id_produto INT PRIMARY KEY,
    quantidade INT,
    valor_produto DECIMAL(10, 2),
    id_empresa INT,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id)
);

-- Adicionar o campo nome_do_produto à tabela logistica
ALTER TABLE logistica
ADD nome_do_produto VARCHAR(100); -- Você pode ajustar o tamanho do campo conforme necessário

-- Inserir registros na tabela transacoes para a empresa cemep (id_empresa = 1)
INSERT INTO transacoes (id_transacao, data_transacao, tipo_transacao, valor_transacao, descricao_transacao, id_empresa, local_transacao)
VALUES
    (1, '2023-09-16 10:00:00', 'Débito', 100.00, 'Compra de suprimentos', 1, 'Loja A'),
    (2, '2023-09-16 15:30:00', 'Crédito', 200.50, 'Recebimento de pagamento', 1, 'Escritório'),
    (3, '2023-09-17 09:15:00', 'Transferência', 50.25, 'Transferência para fornecedor', 1, 'Fornecedor XYZ'),
    (4, '2023-09-17 14:45:00', 'Débito', 75.60, 'Pagamento de fatura', 1, 'Fornecedor ABC'),
    (5, '2023-09-18 11:30:00', 'Crédito', 150.75, 'Recebimento de cliente', 1, 'Cliente X');

-- Inserir registros na tabela funcionario para a empresa cemep (id_empresa = 1)
INSERT INTO funcionario (id_funcionario, data_admissao, nome, idade, setor, id_empresa, email_funcionario, cpf)
VALUES
    (1, '2022-01-15', 'João Silva', 30, 'RH', 1, 'joao.silva@cemep.com', '123.456.789-01'),
    (2, '2021-05-20', 'Maria Santos', 28, 'Financeiro', 1, 'maria.santos@cemep.com', '987.654.321-02'),
    (3, '2023-03-10', 'Pedro Costa', 35, 'Logística', 1, 'pedro.costa@cemep.com', '456.789.123-03'),
    (4, '2022-11-05', 'Ana Pereira', 32, 'TI', 1, 'ana.pereira@cemep.com', '789.123.456-04'),
    (5, '2023-08-25', 'Carlos Oliveira', 28, 'Vendas', 1, 'carlos.oliveira@cemep.com', '234.567.890-05');

-- Inserir registros na tabela logistica para a empresa cemep (id_empresa = 1) com o campo nome_do_produto
INSERT INTO logistica (id_produto, nome_do_produto, quantidade, valor_produto, id_empresa)
VALUES
    (1, 'Produto A', 100, 50.00, 1),
    (2, 'Produto B', 50, 75.50, 1),
    (3, 'Produto C', 200, 20.00, 1),
    (4, 'Produto D', 75, 40.25, 1),
    (5, 'Produto E', 120, 60.75, 1);

select * from transacoes;

select * from empresas;


