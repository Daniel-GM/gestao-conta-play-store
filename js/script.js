function fazerRequisicao() {
  const login = document.getElementById('inputEmail').value
  const senha = document.getElementById('inputSenha').value
  const hash = md5(senha)

  const xhr = new XMLHttpRequest()
  xhr.open('POST', './php/webservice.php', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const resposta = JSON.parse(xhr.responseText)
        tradeDisplay('none', 'block')
        preencherCampos(resposta)
      } else if (xhr.status === 401) {
        errorLogin()
      } else {
        console.error('Erro na requisição:', xhr.status)
      }
    }
  }
  const dados = JSON.stringify({
    login: login,
    senha: hash
  })
  xhr.send(dados)
}

function excluirConta() {
  const id = document.getElementById('id').value
  const idCliente = document.getElementById('idCliente').value
  const xhr = new XMLHttpRequest()

  xhr.open('DELETE', './php/webservice.php')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        alert("Conta excluída com sucesso!")
        hideEditar()
      } else {
        alert("Houve algum problema na exclusão da conta!")
      }
    }
  }
  const dados = JSON.stringify({
    id: id,
    idCliente: idCliente
  })
  xhr.send(dados)
}

function atualizarDados() {
  const id = document.getElementById('id').value
  const idCliente = document.getElementById('idCliente').value

  const email = document.getElementById('inputEditEmail').value
  const nome = document.getElementById('inputEditNome').value
  const celular = document.getElementById('inputEditCelular').value
  const cep = document.getElementById('inputEditCep').value
  const logradouro = document.getElementById('inputEditLogradouro').value
  const bairro = document.getElementById('inputEditBairro').value
  const numero = document.getElementById('inputEditNumero').value
  const complemento = document.getElementById('inputEditComplemento').value
  const referencia = document.getElementById('inputEditReferencia').value

  const xhr = new XMLHttpRequest()
  xhr.open('PUT', './php/webservice.php', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        alert("Dados atualizados com sucesso!")
      } else {
        alert("Houve um problema ao atualizar os dados.")
      }
    }
  }

  const dados = JSON.stringify({
    id: id,
    idCliente: idCliente,
    email: email,
    nome: nome,
    celular: celular,
    cep: cep,
    logradouro: logradouro,
    bairro: bairro,
    numero: numero,
    complemento: complemento,
    referencia: referencia
  })

  xhr.send(dados)
}

function mudarSenha() {
  const novaSenha = document.querySelector("#novaSenha").value
  const confirmarSenha = document.querySelector("#confirmarSenha").value
  const id = document.getElementById('id').value

  if (novaSenha != confirmarSenha) {
    alert("As senhas não são iguais")
  } else {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', './php/webservice.php', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          alert("Senha atualizada com sucesso!")
        } else {
          alert("Houve um problema ao mudar a senha.")
        }
      }
    }

    const hash = md5(novaSenha)

    const dados = JSON.stringify({
      action: "mudar_senha",
      password: hash,
      id: id
    })

    xhr.send(dados)
  }
}

function preencherCampos(dados) {
  document.getElementById('id').value = dados.id
  document.getElementById('idCliente').value = dados.id_cliente
  document.getElementById('inputEditEmail').value = dados.email
  document.getElementById('inputEditNome').value = dados.nome
  document.getElementById('inputEditCelular').value = dados.telefone
  document.getElementById('inputEditCep').value = dados.cep
  document.getElementById('inputEditLogradouro').value = dados.endereco
  document.getElementById('inputEditBairro').value = dados.bairro
  document.getElementById('inputEditNumero').value = dados.numero
  document.getElementById('inputEditComplemento').value = dados.complemento
  document.getElementById('inputEditReferencia').value = dados.referencia
}

function tradeDisplay(stateOne, stateTwo) {
  const login = document.querySelector('#login')
  const editar = document.querySelector('#editar')

  login.style.display = stateOne
  editar.style.display = stateTwo
}

function hideEditar() {
  clearData()
  tradeDisplay('block', 'none')
}

function clearData() {
  document.getElementById('inputEmail').value = ''
  document.getElementById('inputSenha').value = ''
  document.getElementById('id').value = ''
  document.getElementById('idCliente').value = ''
  document.getElementById('inputEditEmail').value = ''
  document.getElementById('inputEditNome').value = ''
  document.getElementById('inputEditCelular').value = ''
  document.getElementById('inputEditCep').value = ''
  document.getElementById('inputEditLogradouro').value = ''
  document.getElementById('inputEditBairro').value = ''
  document.getElementById('inputEditNumero').value = ''
  document.getElementById('inputEditComplemento').value = ''
  document.getElementById('inputEditReferencia').value = ''
  document.getElementById('novaSenha').value = ''
  document.getElementById('confirmarSenha').value = ''
}

function errorLogin() {
  const errorLogin = document.querySelector('#erroLogin')
  errorLogin.style.display = 'block'
  errorLogin.style.color = 'red'
  errorLogin.textContent = 'Login ou senha inválidos'

  setTimeout(() => {
    errorLogin.style.display = 'none'
  }, 3000)
}