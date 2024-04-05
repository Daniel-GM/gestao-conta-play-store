<?php
function conectarBanco() {
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
    if (isset($_POST['login']) && isset($_POST['senha'])) {
        
        $conexao = conectarBanco();
        
        $login = $conexao->real_escape_string($_POST['login']);
        $senha = $conexao->real_escape_string($_POST['senha']);

        $query = "SELECT * FROM sigemenu_teste.usuario_app WHERE email = '$login' AND senha = '$senha'";
        $resultado = $conexao->query($query);
        
        if ($resultado->num_rows == 1) {
            $query = "SELECT ua.id, ua.id_cliente, ua.email, ua.senha, ua.nome, ua.telefone, c.cep, c.endereco, c.numero, c.complemento, c.referencia, c.bairro, c.cidade, c.estado 
            FROM sigemenu_teste.usuario_app AS ua 
            LEFT JOIN sigemenu_teste.cliente AS c 
            ON c.id = ua.id_cliente 
            WHERE ua.email = '$login' 
            AND ua.senha = '$senha'";

            $resultado = $conexao->query($query);

            $dadosUsuario = $resultado->fetch_assoc();
            
            unset($dadosUsuario['senha']);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($dadosUsuario);
            exit;
        } else {
            echo($login);
            http_response_code(401);
            echo json_encode(array('erro' => 'Credenciais inválidas.'));
            exit;
        }
        
        $conexao->close();
        
    } else {
        http_response_code(400);
        echo json_encode(array('erro' => 'Login e senha são obrigatórios.'));
        exit;
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
