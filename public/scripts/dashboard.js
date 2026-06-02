user_name_sidebar.textContent = sessionStorage.NOME_USUARIO;

const COLORS = ['#1b3a52','#2d6a8a','#4a8fa8','#c87941','#8b6b3d','#b8860b'];


function carregarDashboard() {
    const p1 = fetch("/tries").then((r) => r.json());
    const p2 = fetch("/post/list").then((r) => r.json());
    const p3 = fetch("/user/favorite/all").then((r) => {
        if (r.status === 204) return [];
        return r.json();
    });

    Promise.all([p1, p2, p3])
        .then((resultados) => {
            const tentativas = resultados[0];
            const posts = resultados[1];
            const favoritos = resultados[2];
            renderizarKPIs(tentativas, posts, favoritos);
            renderizarRanking(tentativas);
            renderizarFavoritos(favoritos);
            renderizarPosts(posts);
            renderizarPontuacoes(tentativas);
        })
        .catch((erro) => console.error("#ERRO dashboard: ", erro));
}

function renderizarKPIs(tentativas, posts, favoritos) {
    const usuarios = new Set();
    for (let i = 0; i < tentativas.length; i++) usuarios.add(tentativas[i].id_usuario);
    for (let i = 0; i < posts.length; i++) usuarios.add(posts[i].autor_id);

    document.getElementById("kpi_usuarios").textContent   = usuarios.size || "—";
    document.getElementById("kpi_posts").textContent      = posts.filter((p) => !p.parent_id).length;
    document.getElementById("kpi_tentativas").textContent = tentativas.length;

    const contagem = {};
    for (let i = 0; i < favoritos.length; i++) {
        const nome = favoritos[i].especie_nome;
        contagem[nome] = (contagem[nome] || 0) + 1;
    }
    let maisAmado = "—";
    let max = 0;
    const chaves = Object.keys(contagem);
    for (let i = 0; i < chaves.length; i++) {
        if (contagem[chaves[i]] > max) { max = contagem[chaves[i]]; maisAmado = chaves[i]; }
    }
    document.getElementById("kpi_favorito").textContent =
        maisAmado.replace("Pinguim-", "").replace("de-", "");
}

function renderizarRanking(tentativas) {
    const melhores = {};
    for (let i = 0; i < tentativas.length; i++) {
        const t = tentativas[i];
        if (!melhores[t.id_usuario] || t.pontuacao > melhores[t.id_usuario].pontuacao) {
            melhores[t.id_usuario] = t;
        }
    }
    const lista = Object.values(melhores)
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .slice(0, 8);

    new Chart(document.getElementById("chart_ranking"), {
        type: "bar",
        data: {
            labels: lista.map((t) => t.nome),
            datasets: [{
                data: lista.map((t) => t.pontuacao),
                backgroundColor: COLORS[0] + "cc",
                borderColor: COLORS[0],
                borderWidth: 2,
                borderRadius: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, },
            scales: {
                y: { beginAtZero: true, max: 12, grid: { color: "#f0ece4" } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderizarFavoritos(favoritos) {
    console.log(favoritos);
    
    const labels = [];
    const valores = [];

    for (let i = 0; i < favoritos.length; i++) {
        labels.push(favoritos[i].especie_nome);
        valores.push(favoritos[i].total);
    }   

    new Chart(document.getElementById("chart_favoritos"), {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: COLORS.slice(0, labels.length).map((c) => c + "dd"),
                borderColor: "#f5f2ec",
                borderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true, 
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
                                text: label.replace("Pinguim-", "").replace("de-", ""),
                                fillStyle: ds.backgroundColor[i],
                                hidden: false, 
                                index: i
                            }));
                        }
                    }
                }
            }
        }
    });
}

function renderizarPosts(posts) {
    const contagem = {};
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].parent_id) continue;
        const nome = posts[i].nome || "Usuário";
        contagem[nome] = (contagem[nome] || 0) + 1;
    }
    const sorted = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 8);

    new Chart(document.getElementById("chart_posts"), {
        type: "bar",
        data: {
            labels: sorted.map((e) => e[0]),
            datasets: [{
                data: sorted.map((e) => e[1]),
                backgroundColor: COLORS[2] + "cc",
                borderColor: COLORS[2],
                borderWidth: 2,
                borderRadius: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            indexAxis: "y",
            plugins: { legend: { display: false }},
            scales: {
                x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0ece4" } },
                y: { grid: { display: false } }
            }
        }
    });
}

function renderizarPontuacoes(tentativas) {
    const faixas = ["0–3","4–6","7–9","10–12"];
    const contagem = [0, 0, 0, 0];

    for (let i = 0; i < tentativas.length; i++) {
        const p = tentativas[i].pontuacao;
        if (p <= 3)       contagem[0]++;
        else if (p <= 6)  contagem[1]++;
        else if (p <= 9)  contagem[2]++;
        else              contagem[3]++;
    }

    new Chart(document.getElementById("chart_pontuacoes"), {
        type: "bar",
        data: {
            labels: faixas,
            datasets: [{
                label: "Tentativas",
                data: contagem,
                backgroundColor: COLORS.map((c) => c + "cc"),
                borderColor: COLORS,
                borderWidth: 2,
                borderRadius: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false },},
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0ece4" } },
                x: { grid: { display: false } }
            }
        }
    });
}

carregarDashboard();
