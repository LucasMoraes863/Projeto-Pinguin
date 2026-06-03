user_name_sidebar.textContent = sessionStorage.NOME_USUARIO;

const COLORS = [
	"#1b3a52",
	"#2d6a8a",
	"#4a8fa8",
	"#c87941",
	"#8b6b3d",
	"#b8860b",
];

function loadDashboard() {
	const r1 = fetch("/tries").then((r) => r.json());
	const r2 = fetch("/post/list").then((r) => r.json());
	const r3 = fetch("/user/favorite/all").then((r) => {
		if (r.status === 204) return [];
		return r.json();
	});

	Promise.all([r1, r2, r3])
		.then((res) => {
			const tries = res[0];
			const posts = res[1];
			const favorites = res[2];

			renderKPIs(tries, posts, favorites);
			renderRanking(tries);
			renderFavorites(favorites);
			renderPosts(posts);
			renderScores(tries);
		})
		.catch((erro) => console.error("#ERRO dashboard: ", erro));
}

function renderKPIs(tries, posts, favorite) {
	const users = new Set();

	for (let i = 0; i < tries.length; i++) users.add(tries[i].id_usuario);
	for (let i = 0; i < posts.length; i++) users.add(posts[i].autor_id);

	document.getElementById("kpi_users").textContent = users.size;
	document.getElementById("kpi_posts").textContent = posts.length;
	document.getElementById("kpi_tries").textContent = tries.length;

	let mostLoved = "";
	let max = 0;

	for (let i = 0; i < favorite.length; i++) {
		const nome = favorite[i].especie_nome;
  	const currentCount = favorite[i].total; 
		
		if (currentCount > max) {
			max = currentCount;
			mostLoved = nome;
  	}
	}

	document.getElementById("kpi_favorite").textContent = mostLoved;
}

function renderRanking(tries) {
	console.log(tries);
	const best = {};
	for (let i = 0; i < tries.length; i++) {
		const t = tries[i];

		// Verify if best is undefined
		if (!best[t.id_usuario] || t.pontuacao > best[t.id_usuario].pontuacao) {
			best[t.id_usuario] = t;
		}
	}
	const lista = Object.values(best)
		.toSorted((a, b) => a - b)
		.slice(0, 8);

		console.log(lista.map((t) => t.nome))

	new Chart(document.getElementById("chart_ranking"), {
		type: "bar",
		data: {
			labels: lista.map((t) => t.nome),
			datasets: [
				{
					data: lista.map((t) => t.pontuacao),
					backgroundColor: COLORS[0],
					borderColor: COLORS[0],
					borderWidth: 2,
					borderRadius: 2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				y: { beginAtZero: true, max: 7, grid: { color: "#f0ece4" } },
				x: { grid: { display: false } },
			},
		},
	});
}

function renderFavorites(favorites) {
	const labels = [];
	const values = [];

	for (let i = 0; i < favorites.length; i++) {
		labels.push(favorites[i].especie_nome);
		values.push(favorites[i].total);
	}

	new Chart(document.getElementById("chart_favorites"), {
		type: "doughnut",
		data: {
			labels: labels,
			datasets: [
				{
					data: values,
					backgroundColor: COLORS,
					borderColor: "#f5f2ec",
					borderWidth: 3,
					hoverOffset: 6,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			cutout: "60%",
			plugins: {
				legend: {
					display: true,
					position: "bottom",
					labels: {
						boxWidth: 10,
						padding: 10,
						generateLabels: (chart) => {
							const ds = chart.data.datasets[0];
							return chart.data.labels.map((label, i) => ({
								text: label,
								fillStyle: ds.backgroundColor[i],
								hidden: false,
								index: i,
							}));
						},
					},
				},
			},
		},
	});
}

function renderPosts(posts) {
	const count = {};
	for (let i = 0; i < posts.length; i++) {
		if (posts[i].parent_id) continue;
		
		const nome = posts[i].nome;
		count[nome] = (count[nome] || 0) + 1;
	}
	const sorted = Object.entries(count)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8);

		console.log(sorted)
	new Chart(document.getElementById("chart_posts"), {
		type: "bar",
		data: {
			labels: sorted.map((e) => e[0]),
			datasets: [
				{
					data: sorted.map((e) => e[1]),
					backgroundColor: COLORS[2],
					borderColor: COLORS[2],
					borderWidth: 2,
					borderRadius: 2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			indexAxis: "y",
			plugins: { legend: { display: false } },
			scales: {
				x: {
					beginAtZero: true,
					ticks: { stepSize: 1 },
					grid: { color: "#f0ece4" },
				},
				y: { grid: { display: false } },
			},
		},
	});
}

function renderScores(Tries) {
	const faixas = ["0–1", "2-4", "5–7"];
	const count = [0, 0, 0];

	for (let i = 0; i < Tries.length; i++) {
		const p = Tries[i].pontuacao;
		if (p <= 2) count[0]++;
		else if (p <= 5) count[1]++;
		else count[2]++;
	}

	new Chart(document.getElementById("chart_scores"), {
		type: "bar",
		data: {
			labels: faixas,
			datasets: [
				{
					label: "Tentativas",
					data: count,
					backgroundColor: COLORS,
					borderColor: COLORS,
					borderWidth: 2,
					borderRadius: 2,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				y: {
					beginAtZero: true,
					ticks: { stepSize: 1 },
				},
				x: { grid: { display: false } },
			},
		},
	});
}

loadDashboard();
