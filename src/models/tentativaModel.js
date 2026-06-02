const database = require("../database/config");

function listarTentativas() {
	console.log(
		"ACESSEI O PERGUNTA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);
	const instrucaoSql = `
        SELECT
            u.id AS id_usuario,
            u.nome,
            t.pontuacao,
            t.realizado_em
        FROM tentativa t
        JOIN usuario u ON t.fk_usuario = u.id;
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

function listarMelhorTentativaUsuario(idUsuario) {
    console.log(
		"ACESSEI O PERGUNTA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);
	const instrucaoSql = `
        SELECT
            realizado_em AS data_tentativa,
            pontuacao
        FROM tentativa 
        WHERE fk_usuario = ${idUsuario}
        ORDER BY pontuacao DESC
        LIMIT 1;
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

function listarTentativasPorUsuario(idUsuario) {
	console.log(
		"ACESSEI O PERGUNTA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);
	const instrucaoSql = `
        SELECT
            realizado_em AS data_tentativa,
            pontuacao
        FROM tentativa 
        WHERE fk_usuario = ${idUsuario}
        ORDER BY data_tentativa;
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

function listarMelhorUsuario(idUsuario) {
	console.log(
		"ACESSEI O TENTATIVA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);

	// Busca a melhor tentativa do usuário (maior pontuação, menor tempo)
	const instrucaoSql = `
        SELECT
            pontuacao,
            total_perguntas,
            realizado_em
        FROM tentativa
        WHERE fk_usuario = ${idUsuario}
        ORDER BY pontuacao DESC
        LIMIT 1;
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

function listarRanking() {
	console.log(
		"ACESSEI O PERGUNTA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente",
	);
	const instrucaoSql = `
        SELECT
            u.id,
            u.nome,
            CONCAT(t.pontuacao, '/', t.total_perguntas) AS pontuacao,
            DATE_FORMAT(t.realizado_em, '%d/%m') AS data_tentativa
        FROM usuario u
        JOIN tentativa t 
            ON t.fk_usuario = u.id
        WHERE t.id = (
            SELECT t2.id
            FROM tentativa t2
            WHERE t2.fk_usuario = u.id
            ORDER BY 
                t2.pontuacao DESC,
            LIMIT 1
        )
        ORDER BY 
            t.pontuacao DESC,
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

function salvarTentativa(pontuacao, fk_usuario) {
	const instrucaoSql = `
        INSERT INTO tentativa (pontuacao, fk_usuario) 
        VALUES (${pontuacao}, ${fk_usuario});
    `;
	console.log("Executando a instrução SQL: \n" + instrucaoSql);
	return database.executar(instrucaoSql);
}

module.exports = {
	listarTentativas,
	listarRanking,
	listarTentativasPorUsuario,
	listarMelhorUsuario,
	salvarTentativa,
    listarMelhorTentativaUsuario
};
