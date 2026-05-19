user_name_sidebar.innerHTML = sessionStorage.NOME_USUARIO;

function limparFormulario() {
	ipt_title_post.value = "";
	ipt_content_post.value = "";
}

function publicarComentario(id_post) {
	var idUsuario = sessionStorage.ID_USUARIO;
	let comment = document.getElementById(`comment_${id_post}`);
	let conteudo = comment.value;

	var corpo = {
		usuario: idUsuario,
		conteudo: conteudo,
	};

	fetch(`/post/comment/${id_post}`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(corpo),
	})
		.then(function (resposta) {
			if (resposta.ok) {
				comment.value = "";
				location.reload();
			} else if (resposta.status == 404) {
				window.alert("Deu 404!");
			} else {
				throw (
					"Houve um erro ao tentar realizar o comentario! Código da resposta: " +
					resposta.status
				);
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
		});
}

function publicar() {
	var idUsuario = sessionStorage.ID_USUARIO;

	var corpo = {
		titulo: ipt_title_post.value,
		conteudo: ipt_content_post.value,
	};

	fetch(`/post/publish/${idUsuario}`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(corpo),
	})
		.then(function (resposta) {
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
					no_content.style.display = 'flex'
					no_content_text.innerHTML = 'Nenhum post encontrado.'
					return;
				}

				resposta.json().then(function (respostaJson) {
					const feed = document.getElementById("feed_container");
					feed.innerHTML = "";

					const posts = respostaJson.filter((p) => p.titulo != null);
					const comments = respostaJson.filter((p) => p.titulo == null);

					for (let i = posts.length - 1; i >= 0; i--) {
						const publicacao = posts[i];
						const data_formatada = formatarData(publicacao.criado_em);

						const comentariosDestePost = comments.filter(
							(c) => c.parent_id === publicacao.idPost,
						);

						let comentariosHtml = "";

						for (let i = comentariosDestePost.length - 1; i >= 0; i--) {
							const comentario_atual = comments[i];
							comentariosHtml += `
									<div class="comment">
										<div class="comment-meta">
											<img class="comment-avatar" src="../../images/icons/user.png" alt="">
											<span class="comment-author">${comentario_atual.nome}</span>
											<span class="comment-date">${formatarData(comentario_atual.criado_em)}</span>
										</div>
										<p class="comment-body">${comentario_atual.conteudo}</p>
									</div>
								`;
						}

						feed.innerHTML += `
								<div class="post">
										<div class="post-meta">
											<img class="post-avatar" src="../../images/icons/user.png" alt="">
												<span class="post-author">${publicacao.nome}</span>
												<span class="post-sep"></span>
												<span class="post-date">${data_formatada}</span>
										</div>
												
										<h2 class="post-title">
												${publicacao.titulo}
										</h2>
										<p class="post-body">
												${publicacao.conteudo}
										</p>

										<div class="comments"> 
              				${comentariosHtml} 
										</div>

											<div class="reply-input-wrap">
													<input class="reply-input" type="text"  id="comment_${publicacao.idPost}" placeholder="Escreva uma resposta…" />
													<button class="btn-solid" onclick="publicarComentario(${publicacao.idPost})" >Enviar</button>
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

function formatarData(dataString) {
	const data = new Date(dataString);

	return (
		data.toLocaleDateString("pt-BR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}) +
		" · " +
		data.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		})
	);
}

atualizarFeed();
