function fazerRequisicao() {
  const login = document.getElementById('inputEmail').value
  const senha = document.getElementById('inputSenha').value
  const hash = md5(senha)

  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost/Gestao-Conta/php/webservice.php', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
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
  const dados = 'login=' + encodeURIComponent(login) + '&senha=' + encodeURIComponent(hash)
  xhr.send(dados)
}

function excluirConta() {
  const id = document.getElementById('id').value
  const idCliente = document.getElementById('idCliente').value
  const xhr = new XMLHttpRequest()

  xhr.open('DELETE', 'http://localhost/Gestao-Conta/php/webservice.php')
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