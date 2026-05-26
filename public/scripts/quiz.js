const nome  = sessionStorage.NOME_USUARIO  

user_name_sidebar.textContent = nome;


let perguntasRespostas = [];
let perguntaAtual = 0;
let acertos = 0;
let tempoSegundos = 0;
let intervaloTempo;
let historico = [];
//TODO: CRONOMETRO NA TENTATIVA
//TODO: MOSTRAR PERGUNTA ATUAL E QUANTAS FALTAM


function listarPerguntasRespostas() {
	fetch("/trivia/perguntas-respostas")
		.then((res) => res.json())
		.then((resposta) => {
			//TODO: SEM PERGUNTAS TELA
			if (!resposta || resposta.length == 0) return;

			// Agrupamento limpo das perguntas e respostas
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
			iniciarContador();
		})
		.catch((erro) => console.error("#ERRO ao buscar perguntas: ", erro));
}

function iniciarContador() {
	clearInterval(intervaloTempo);
	intervaloTempo = setInterval(() => {
		tempoSegundos++;
	}, 1000);
}

function pausarContador() {
	clearInterval(intervaloTempo);
}

function exibirPergunta() {
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
	pausarContador();
	salvarTentativa();

	const pct = acertos / perguntasRespostas.length;
	let titulo = "";
	let subtitulo = "";
	let descricao = "";

	if (pct >= 0.92) {
		titulo = "Especialista em Pinguins";
		subtitulo = "Nível Máximo";
		descricao =
			"Conhecimento extraordinário! Você domina a biologia, o comportamento e a história evolutiva dos pinguins.";
	} else if (pct >= 0.67) {
		titulo = "Biólogo(a) Honorário(a)";
		subtitulo = "Nível Avançado";
		descricao =
			"Ótimo desempenho! Você claramente tem muito interesse e conhecimento sobre pinguins.";
	} else if (pct >= 0.42) {
		titulo = "Observador(a) de Pinguins";
		subtitulo = "Nível Intermediário";
		descricao =
			"Bom começo! Você acertou bastante coisa, mas ainda há muito para descobrir.";
	} else {
		titulo = "Filhote Aprendiz";
		subtitulo = "Nível Iniciante";
		descricao =
			"Todo especialista começa assim! Tente de novo — na próxima você vai muito melhor.";
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

	fetch("/tentativa/postar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			pontuacao: acertos,
			tempoSegundos: tempoSegundos,
			idUsuario: idUsuario
		}),
	})
		.then((res) => res.json())
		.then((data) => console.log("Tentativa salva: ", data))
		.catch((erro) => console.error("#ERRO ao salvar tentativa: ", erro));
}

listarPerguntasRespostas();
