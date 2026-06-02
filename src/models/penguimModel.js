const database = require("../database/config");


function listarTodosPenguins() {
	console.log(
		"ACESSEI O PERGUNTA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);
	const instrucaoSql = `
        SELECT 
            id, 
            nome, 
            nome_cientifico AS cientifico, 
            imagem_url AS img
        FROM 
            especie;
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}


module.exports = {
  listarTodosPenguins
};
