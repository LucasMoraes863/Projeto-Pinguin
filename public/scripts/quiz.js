const nome  = sessionStorage.NOME_USUARIO  

user_name_sidebar.textContent = nome;


let perguntasRespostas = [];
let perguntaAtual = 0;
let acertos = 0;
let historico = [];

function verificarTentativa() {
	const idUsuario = sessionStorage.ID_USUARIO;

	fetch("/tries/user/best/" + idUsuario)
			.then((res) => res.json())
			.then((tentativas) => {
					if (tentativas && tentativas.length > 0) {
						Bloquear(tentativas[0]);
					} else {
						listarPerguntasRespostas();
					}
			})
}

function Bloquear(melhor) {
    const pct = melhor.pontuacao / 12;
    let titulo = "Iniciante";
    if (pct >= 0.92) titulo = "Especialista";
    else if (pct >= 0.67) titulo = "Biólogo";
    else if (pct >= 0.42) titulo = "Muito chão pela frente!";

    document.getElementById("blocked_title").textContent = titulo;
    document.getElementById("blocked_right").textContent = `${melhor.pontuacao} / 12`;
    document.getElementById("blocked_date").textContent = new Date(melhor.data_tentativa).toLocaleDateString("pt-BR");

    document.getElementById("quiz_screen").style.display = "none";
    document.getElementById("result_screen").style.display = "none";
    document.getElementById("blocked_screen").style.display = "flex";
}

function desbloquearQuiz() {
	document.getElementById("blocked_screen").style.display = "none";
	listarPerguntasRespostas();
}

function listarPerguntasRespostas() {
	fetch("/questions/questions-answers")
		.then((res) => res.json())
		.then((resposta) => {
			//TODO: SEM PERGUNTAS TELA
			if (!resposta || resposta.length == 0) return;

			const perguntasMap = {};

			for (let i = 0; i < resposta.length; i++) {
				const atual = resposta[i];

				if (!perguntasMap[atual.id_pergunta]) {
					perguntasMap[atual.id_pergunta] = {
						id_pergunta: atual.id_pergunta,
						categoria: atual.categoria,
						dificuldade: atual.dificuldade,
						pergunta: atual.pergunta,
						respostas: [],
					};
				}

				perguntasMap[atual.id_pergunta].respostas.push({
					id_resposta: atual.id_resposta,
					resposta: atual.resposta,
					correta: atual.correta == 1,
					explicacao: atual.explicacao,
				});
			}

			perguntasRespostas = Object.values(perguntasMap);

			exibirPergunta();
		})
		.catch((erro) => console.error("#ERRO ao buscar perguntas: ", erro));
}



function exibirPergunta() {
	document.getElementById("quiz_screen").style.display = "flex";
	
	const p = perguntasRespostas[perguntaAtual];

	document.getElementById("question_text").textContent = p.pergunta;

	const badge = document.getElementById("badge_dificuldade");
	let diffText = "Difícil";
	if (p.dificuldade == "facil") diffText = "Fácil";
	else if (p.dificuldade == "medio") diffText = "Médio";

	badge.textContent = diffText;
	badge.className = `badge-dificuldade badge-${p.dificuldade}`;

	document.getElementById("explicacao_box").style.display = "none";
	document.getElementById("next_btn").style.display = "none";

	const container = document.getElementById("answers_container");
	let buttons = "";

	for (let i = 0; i < p.respostas.length; i++) {
		const resp = p.respostas[i];

		buttons += `
            <button class="answer-btn" onclick="verificarResposta(${i})">
                ${resp.resposta}
            </button>
        `;
	}

	container.innerHTML = buttons;
}

function verificarResposta(resp) {
	const p = perguntasRespostas[perguntaAtual];
	const respSelecionada = p.respostas[resp];
	const acertou = respSelecionada.correta;

	if (acertou) acertos++;

	historico.push({
		pergunta: p.pergunta,
		acertou: acertou,
		dificuldade: p.dificuldade,
	});

	const botoes = document.querySelectorAll(".answer-btn");

	for (let i = 0; i < botoes.length; i++) {
		const botao = botoes[i];
		botao.disabled = true;

		if (p.respostas[i].correta) {
			botao.classList.add("correta");
		} else if (i == resp && !acertou) {
			botao.classList.add("errada");
		}
	}

	let expCorreta = "Sem explicação disponível.";

	for (let i = 0; i < p.respostas.length; i++) {
		if (p.respostas[i].correta && p.respostas[i].explicacao) {
			expCorreta = p.respostas[i].explicacao;
			break;
		}
	}

	const expBox = document.getElementById("explicacao_box");
	expBox.className = `explicacao ${acertou ? "explicacao-ok" : "explicacao-err"}`;

	document.getElementById("explicacao_text").textContent = expCorreta;
	expBox.style.display = "block";

	const nextBtn = document.getElementById("next_btn");
	nextBtn.style.display = "block";

	if (perguntaAtual < perguntasRespostas.length - 1) {
		nextBtn.textContent = "Próxima →";
	} else {
		nextBtn.textContent = "Ver resultado →";
	}
}

function proximaPergunta() {
	perguntaAtual++;
	if (perguntaAtual >= perguntasRespostas.length) {
		mostrarResultado();
	} else {
		exibirPergunta();
	}
}

function mostrarResultado() {
	salvarTentativa();

	const pct = acertos / perguntasRespostas.length;
	let titulo = "";
	let subtitulo = "";
	let descricao = "";

	if (pct >= 0.92) {
		titulo = "Especialista";
		subtitulo = "Nível Máximo";
		descricao =
			"Conhecimento extraordinário! Você domina a biologia e a história dos pinguins.";
	} else if (pct >= 0.67) {
		titulo = "Biólogo";
		subtitulo = "Nível Avançado";
		descricao =
			"Ótimo desempenho! Você claramente tem muito interesse por pinguins.";
	} else if (pct >= 0.42) {
		titulo = "Muito chão pela frente";
		subtitulo = "Nível Intermediário";
		descricao =
			"Bom começo! Você acertou bastante coisa.";
	} else {
		titulo = "Jovem";
		subtitulo = "Nível Iniciante";
		descricao =
			"Poderia ter sido melhor! Tente de novo.";
	}

	document.getElementById("res_title").textContent = titulo;
	document.getElementById("res_subtitle").textContent = subtitulo;
	document.getElementById("res_descricao").textContent = descricao;
	document.getElementById("res_acertos").textContent = acertos;

	let resumo = "";
	for (let i = 0; i < historico.length; i++) {
		const atual = historico[i];

		let diffLabel = "D";
		if (atual.dificuldade == "facil") diffLabel = "F";
		else if (atual.dificuldade == "medio") diffLabel = "M";

		resumo += `
            <div class="resumo-item ${atual.acertou ? "resumo-ok" : "resumo-err"}">
                <span class="resumo-icon">${atual.acertou ? "✓" : "✗"}</span>
                <span class="resumo-texto">${atual.pergunta}</span>
                <span class="resumo-diff resumo-diff-${atual.dificuldade}">
                    ${diffLabel}
                </span>
            </div>
        `;
	}
	document.getElementById("res_resumo").innerHTML = resumo;

	document.getElementById("quiz_screen").style.display = "none";
	document.getElementById("result_screen").style.display = "flex";
}

function salvarTentativa() {
	const idUsuario = sessionStorage.ID_USUARIO  

	fetch("/tries/post", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			pontuacao: acertos,
			idUsuario: idUsuario
		}),
	})
		.then((res) => res.json())
		.then((data) => console.log("Tentativa salva: ", data))
		.catch((erro) => console.error("#ERRO ao salvar tentativa: ", erro));
}

verificarTentativa()