<?php
function conectar()
{
    // Define as credenciais de acesso ao banco de dados
    $host = 'localhost';
    $user = 'root';
    $pass = 'password';
    $db = 'empresa';

    // Cria a conexão com o MySQL
    $conn = new mysqli($host, $user, $pass, $db);

    // Verifica se houve erro na conexão
    if (!$conn) {
        die('Não foi possível conectar ao banco de dados: ' . mysqli_connect_error());
    }else{
        echo "Conexão efetuada com sucesso";
    }

    // Retorna a conexão
    return $conn;
}

function inserir_dados($nome_empresa, $email_empresa, $telefone_empresa, $cnpj_empresa, $senha)
{
    // Cria a conexão com o MySQL
    $conn = conectar();

    // Cria a query SQL para inserir os dados na tabela
    $query = "INSERT INTO empresas (nome_empresa, email_empresa, telefone_empresa, cnpj_empresa, senha)
     VALUES ('$nome_empresa', '$email_empresa', '$telefone_empresa', '$cnpj_empresa', '$senha')";

    // Executa a query SQL
    $resultado = mysqli_query($conn, $query);

    // Verifica se a query foi executada com sucesso
    if ($resultado) {
        echo 'Dados inseridos com sucesso!';
    } else {
        echo 'Erro ao inserir dados: ' . mysqli_error($conn);
    }

    // Fecha a conexão com o MySQL
    mysqli_close($conn);
}

// Recebe os dados do formulário
$nome_empresa = $_POST['nome_empresa'];
$email_empresa = $_POST['email_empresa'];
$telefone_empresa = $_POST['telefone_empresa'];
$cnpj_empresa = $_POST['cnpj_empresa'];
$senha = $_POST['senha'];

// Chama a função inserir_dados() para inserir os dados no banco de dados
//inserir_dados($nome_empresa, $email_empresa, $telefone_empresa, $cnpj_empresa, $senha);
conectar();
?>