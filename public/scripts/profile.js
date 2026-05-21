const nome  = sessionStorage.NOME_USUARIO  
const email = sessionStorage.EMAIL_USUARIO
const id    = sessionStorage.ID_USUARIO    

user_name_sidebar.textContent = nome;
perfil_nome.textContent  = nome;
perfil_email.textContent = email;

function getAllPostsCount() {
  fetch(`/post/listar/${id}`)
    .then((resposta) => {
      const count = document.getElementById("total_posts")
      if (resposta.ok) {
        console.log(resposta.status)
        if (resposta.status == 204) {
					count.innerHTML = 0;
					return;
				}
        resposta.json().then((respostaJson) => {
          count.innerHTML = `${respostaJson.total_posts}`;
          return;
        })
      } else {
				console.log("Houve um erro na API!");
			}
    })
    .catch(function (erro) {
			console.error(erro);
		});
}

getAllPostsCount()