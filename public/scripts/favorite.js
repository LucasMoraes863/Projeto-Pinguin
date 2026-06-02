user_name_sidebar.textContent = sessionStorage.NOME_USUARIO;

let especies;

async function getPenguins() {
	fetch("/penguim/get-all")
		.then((res) => {
			if (res.status === 204) return null;
            return res.json();
		})
        .then((penguins) => {
            especies = penguins;
            console.log(especies) 
        })
		.catch((error) => {
			console.error(error);
		});
}

function init() {
	fetch("/user/favorite/" + sessionStorage.ID_USUARIO)
		.then((res) => {
			if (res.status === 204) return null;
			return res.json();
		})
		.then((favorito) => {
			if (favorito) {
				exibirBloqueio(favorito);
			} else {
                exibirEscolha();
			}
		})
    }

function exibirBloqueio(favorito) {
	document.getElementById("bloqueio_nome").textContent = favorito.nome;
	document.getElementById("bloqueio_cientifico").textContent =
		favorito.nome_cientifico;
    document.getElementById("bloqueio_img").src = favorito.imagem_url;
    document.getElementById("bloqueio_img").alt = favorito.nome;
    document.getElementById("bloqueio_screen").style.display = "flex";
}
    
function change() {
    document.getElementById("bloqueio_screen").style.display = "none";
    exibirEscolha();
}

function exibirEscolha() {
	const grid = document.getElementById("especies_grid");
	let html = "";
    
	for (let i = 0; i < especies.length; i++) {
        const e = especies[i];
		html += `
        <div class="favorito-card" onclick="salvarFavorito(${e.id})">
                <div class="favorito-card-img">
                    <img src="${e.img}" alt="${e.nome}">
                </div>
                <div class="favorito-card-info">
                <p class="favorito-card-nome">${e.nome}</p>
                <p class="favorito-card-sci">${e.cientifico}</p>
                </div>
            </div>
            `;
        }
        
        grid.innerHTML = html;
        document.getElementById("escolha_screen").style.display = "flex";
    }

function salvarFavorito(idEspecie) {
	fetch("/user/favorite/" + sessionStorage.ID_USUARIO, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ idEspecie: idEspecie }),
	})
    .then((res) => res.json())
    .then(() => {
        const especie = especies[idEspecie - 1];
        exibirBloqueio({
            nome: especie.nome,
            nome_cientifico: especie.cientifico,
            imagem_url: especie.img,
			});
			document.getElementById("escolha_screen").style.display = "none";
		})
		.catch((erro) => console.error("#ERRO ao salvar favorito: ", erro));
}

getPenguins();
init();