function invalidoMensagem(message) {
	cardErro.style.display = "block";
	error_message.innerHTML = message;
	return
}

function validoMensagem(message) {
	cardMessage.style.display = "block";
	success_message.innerHTML = message;
	return
}


function sumirMensagem() {
	cardErro.style.display = "none";
}

function cadastrar() {
	var nomeVar = ipt_username.value;
	var emailVar = ipt_email.value;
	var senhaVar = ipt_password.value;
	var confirmacaoSenhaVar = ipt_con_password.value;

	if (nomeVar == "" || emailVar == "" || senhaVar == "" || confirmacaoSenhaVar == "") {
		invalidoMensagem("Preencha todos os campos corretamente.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (nomeVar.length < 2) {
		invalidoMensagem("Digite um nome válido");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (!emailVar.includes("@") || !emailVar.includes(".")) {
		invalidoMensagem("Digite um email válido.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (senhaVar.length < 8) {
		invalidoMensagem("A senha precisa ter mais de 8 caracteres.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (confirmacaoSenhaVar != senhaVar) {
		invalidoMensagem("Senhas não coicidem.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	
	//Loading gif
	btn_submit.style.display = "none"
	loading_gif.style.display = "flex"
	
	fetch("/user/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			nomeServer: nomeVar,
			emailServer: emailVar,
			senhaServer: senhaVar,
		}),
	})
		.then(function (resposta) {
			console.log("resposta: ", resposta);

			if (resposta.ok) {
				cardErro.style.display = "none";
				validoMensagem("Cadastro realizado com sucesso! Redirecionando para tela de Login...")

				setTimeout(() => {
					window.location = "../pages/login.html";
				}, "2000");

			} else {
				btn_submit.style.display = "block"
				loading_gif.style.display = "none"
				invalidoMensagem("Houve um erro ao tentar realizar o cadastro!")
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
		});

	return false;
}

function entrar() {
	var emailVar = ipt_email.value;
	var senhaVar = ipt_password.value;

	if (emailVar == "" || senhaVar == "") {
		invalidoMensagem("Preencha todos os campos corretamente.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

  if (!emailVar.includes("@") || !emailVar.includes(".")) {
		invalidoMensagem("Digite um email válido.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	//Loading gif
	btn_submit.style.display = "none"
	loading_gif.style.display = "flex"

	fetch("/user/auth", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			emailServer: emailVar,
			senhaServer: senhaVar,
		}),
	})
		.then(function (resposta) {
			console.log("ESTOU NO THEN DO entrar()!");

			if (resposta.ok) {
				console.log(resposta);

				resposta.json().then((json) => {
					console.log(json);
					console.log(JSON.stringify(json));
					sessionStorage.EMAIL_USUARIO = json.email;
					sessionStorage.NOME_USUARIO = json.nome;
					sessionStorage.ID_USUARIO = json.id;

					setTimeout(function () {
						window.location = "./community/main.html";
					}, 1000); 
				});
			} else {
				resposta.text().then((texto) => {
					if(resposta.status == 403) {
						btn_submit.style.display = "block"
						loading_gif.style.display = "none"
						invalidoMensagem(texto);
					} else {
						setInterval(sumirMensagem, 5000);
					}
				})
			}
		})
		.catch(function (erro) {
			console.log(erro);
		});

	return false;
}

