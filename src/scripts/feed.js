user_name_sidebar.innerHTML = sessionStorage.NOME_USUARIO;

function limparFormulario() {
	ipt_title_post.value = "";
	ipt_content_post = "";
}

function publicar() {
	var idUsuario = sessionStorage.ID_USUARIO;

	var corpo = {
		titulo: ipt_title_post.value,
		descricao: ipt_content_post.value,
	};

	fetch(`/post/publish/${idUsuario}`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(corpo),
	})
		.then(function (resposta) {
			console.log("resposta: ", resposta);

			if (resposta.ok) {
				limparFormulario();
				atualizarFeed();
				location.reload();
			} else if (resposta.status == 404) {
				window.alert("Deu 404!");
			} else {
				throw (
					"Houve um erro ao tentar realizar a postagem! Código da resposta: " +
					resposta.status
				);
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
		});

	return false;
}

function atualizarFeed() {
	console.log("Atualizando");
	fetch("/post/list")
		.then(function (resposta) {
			if (resposta.ok) {
				if (resposta.status == 204) {
					alert("Nenhum resultado encontrado.");
					throw "Nenhum resultado encontrado!!";
				}

				resposta.json().then(function (respostaJson) {
					var feed = document.getElementById("feed_container");
					feed.innerHTML = "";

					for (let i = respostaJson.length - 1; i >= 0; i--) {
						var publicacao = respostaJson[i];

						var dataObj = new Date(publicacao.criado_em);
						var dataFormatada =
							dataObj.toLocaleDateString("pt-BR", {
								day: "numeric",
								month: "short",
								year: "numeric",
							}) +
							" · " +
							dataObj.toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							});

						//TODO: CRIAR UMA FUNÇÂO PARA LISTAR OS COMENTARIOS
						feed.innerHTML += `
                        <div class="post">
                            <div class="post-meta">
                                <span class="post-author">${publicacao.nome}</span>
                                <span class="post-sep"></span>
                                <span class="post-date">${dataFormatada}</span>
                            </div>
                                
                            <h2 class="post-title">
                                ${publicacao.titulo}
                            </h2>
                            <p class="post-body">
                                ${publicacao.conteudo}
                            </p>

                            <div class="reply-input-wrap">
                                <input class="reply-input" type="text" placeholder="Escreva uma resposta…" />
                                <button class="btn-solid">Enviar</button>
                            </div>
                        </div>
                    `;
					}
				});
			} else {
				throw "Houve um erro na API!";
			}
		})
		.catch(function (erro) {
			console.error(erro);
		});
}

atualizarFeed();
