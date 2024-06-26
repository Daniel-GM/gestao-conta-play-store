<?php
function conectarBanco()
{
    $host = 'localhost';
    $usuario = 'root';
    $senha = '';
    $banco = 'sigemenu_teste';

    $conexao = new mysqli($host, $usuario, $senha, $banco);
    if ($conexao->connect_error) {
        die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
    }
    return $conexao;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $conexao = conectarBanco();

    if (isset($data->login) && isset($data->senha)) {

        $login = $data->login;
        $senha = $data->senha;

        $query = "SELECT * FROM sigemenu_teste.usuario_app 
        WHERE (email = '$login' OR usuario = '$login' OR telefone = '$login') 
        AND senha = '$senha'";
        $resultado = $conexao->query($query);

        if ($resultado->num_rows == 1) {
            $query = "SELECT ua.id, ua.id_cliente, ua.usuario, ua.email, ua.senha, ua.nome, ua.telefone, c.cep, c.endereco, c.numero, c.complemento, c.referencia, c.bairro, c.cidade, c.estado 
            FROM sigemenu_teste.usuario_app AS ua 
            LEFT JOIN sigemenu_teste.cliente AS c 
            ON c.id = ua.id_cliente 
            WHERE (ua.email = '$login' OR ua.usuario = '$login' OR ua.telefone = '$login') 
            AND ua.senha = '$senha'";

            $resultado = $conexao->query($query);

            $dadosUsuario = $resultado->fetch_assoc();

            unset($dadosUsuario['senha']);

            $conexao->close();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($dadosUsuario);
            exit;
        } else {
            echo ($login);
            http_response_code(401);
            echo json_encode(array('erro' => 'Credenciais inválidas.'));
            exit;
        }


    } else {
        http_response_code(400);
        echo json_encode(array('erro' => 'Login e senha são obrigatórios.'));
        exit;
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $conexao = conectarBanco();

    if ($data->action == 'mudar_senha') {
        $id = $data->id;
        $password = $data->password;

        $query = "UPDATE sigemenu_teste.usuario_app 
                    SET senha = '$password'
                    WHERE id = '$id'";

        echo($query);

        if ($conexao->query($query) === TRUE) {
            http_response_code(200);
            echo json_encode(array('mensagem' => 'Dados atualizados com sucesso.'));
        } else {
            http_response_code(500);
            echo json_encode(array('erro' => 'Erro ao atualizar dados.'));
        }

    } else if (isset($data->id) && isset($data->idCliente)) {
        $id = $data->id;
        $idCliente = $data->idCliente;
        $email = $data->email;
        $nome = $data->nome;
        $telefone = $data->celular;
        $cep = $data->cep;
        $logradouro = $data->logradouro;
        $bairro = $data->bairro;
        $numero = $data->numero;
        $complemento = $data->complemento;
        $referencia = $data->referencia;

        $queryUsuarioApp = "UPDATE sigemenu_teste.usuario_app 
                            SET email = '$email', 
                                telefone = '$telefone', 
                                nome = '$nome' 
                            WHERE id = '$id'";

        $queryCliente = "UPDATE sigemenu_teste.cliente 
                        SET nome = '$nome', 
                            cep = '$cep', 
                            endereco = '$logradouro',
                            bairro = '$bairro',
                            numero = '$numero',
                            complemento = '$complemento',
                            referencia = '$referencia'
                        WHERE id = '$idCliente'";

        if ($conexao->query($queryUsuarioApp) === TRUE && $conexao->query($queryCliente) === TRUE) {
            http_response_code(200);
            echo json_encode(array('mensagem' => 'Dados atualizados com sucesso.'));
        } else {
            http_response_code(500);
            echo json_encode(array('erro' => 'Erro ao atualizar dados.'));
        }

        $conexao->close();

    } else {
        http_response_code(400);
        echo json_encode(array('erro' => 'Todos os campos são obrigatórios.'));
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if (isset($data->id) && isset($data->idCliente)) {
        $conexao = conectarBanco();
        $idUsuarioApp = $conexao->real_escape_string($data->id);
        $idCliente = $conexao->real_escape_string($data->idCliente);

        $queryUsuarioApp = "DELETE FROM sigemenu_teste.usuario_app WHERE id = '$idUsuarioApp'";
        $queryCliente = "DELETE FROM sigemenu_teste.cliente WHERE id = '$idCliente'";
        if ($conexao->query($queryUsuarioApp) === TRUE && $conexao->query($queryCliente) === TRUE) {
            http_response_code(200);
            echo json_encode(array('mensagem' => 'Registro excluído com sucesso.'));
        } else {
            http_response_code(500);
            echo json_encode(array('erro' => 'Erro ao excluir registro.'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('erro' => 'Usuário não encontrado.'));
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(array('erro' => 'Método não permitido.'));
    exit;
}
