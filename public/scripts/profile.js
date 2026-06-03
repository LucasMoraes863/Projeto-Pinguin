const nome = sessionStorage.NOME_USUARIO;
const email = sessionStorage.EMAIL_USUARIO;
const id = sessionStorage.ID_USUARIO;

user_name_sidebar.textContent = nome;
perfil_nome.textContent = nome;
perfil_email.textContent = email;

function getAllPostsCount() {
	fetch(`/post/list/${id}`)
		.then((resposta) => {
			const count = document.getElementById("total_posts");
			if (resposta.ok) {
				console.log(resposta.status);
				if (resposta.status == 204) {
					count.innerHTML = 0;
					return;
				}
				resposta.json().then((respostaJson) => {
					count.innerHTML = `${respostaJson.total_posts}`;
					return;
				});
			} else {
				console.log("Houve um erro na API!");
			}
		})
		.catch(function (erro) {
			console.error(erro);
		});
}

// GRAFICO DE TENTATIVAS

async function getTries() {
	const res = await fetch(`/tries/user/${id}`);

	if (res.status === 204) {
		renderizarHistoricoLinha([]);
		return;
	}

	const dados = await res.json();
	if (dados.length > 0) {
		document.getElementById("quiz_not_done_icon").style.display = "none"
		document.getElementById("quiz_done_icon").style.display = "block"
	}
	renderizarHistoricoLinha(dados);
}

function renderizarHistoricoLinha(tentativas) {
	console.log(tentativas);
	const labels = [];
	const scoreData = [];

	for (let i = 0; i < tentativas.length; i++) {
		const tentativa = tentativas[i];

		const data = new Date(tentativa.data_tentativa);
		const dataFormatada =
			data.toLocaleDateString("pt-BR") +
			" " +
			data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

		labels.push(dataFormatada);
		scoreData.push(tentativa.pontuacao);
	}

	new Chart(document.getElementById("chart_historico"), {
		type: "line",
		data: {
			labels: labels,
			datasets: [
				{
					label: "Pontuação",
					data: scoreData,
					borderColor: "#4a8fa8",
					backgroundColor: "#4a8fa8",
					borderWidth: 2,
					tension: 0.2,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				y: { beginAtZero: true, max: 7, grid: { color: "#f0ece4" } },
				x: { grid: { display: false } },
			},
		},
	});
}
getAllPostsCount();
getTries();
