const database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    const instrucaoSql = `
        SELECT id, nome, email FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarFavorito(idUsuario, idEspecie) {
    console.log("ACESSEI O USUARIO MODEL - function atualizarFavorito(): ", idUsuario, idEspecie);
    const instrucaoSql = `
        UPDATE usuario SET especie_favorita_id = ${idEspecie} WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFavoritoPorUsuario(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL - function buscarFavoritoPorUsuario(): ", idUsuario);
    const instrucaoSql = `
        SELECT e.id, e.nome, e.nome_cientifico, e.imagem_url
        FROM usuario u
        JOIN especie e ON u.especie_favorita_id = e.id
        WHERE u.id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTodosFavoritos() {
    console.log("ACESSEI O USUARIO MODEL - function buscarTodosFavoritos()");
    const instrucaoSql = `
        SELECT e.id AS especie_id, e.nome AS especie_nome, COUNT(u.id) AS total
        FROM especie e
        JOIN usuario u ON u.especie_favorita_id = e.id
        GROUP BY e.id, e.nome
        ORDER BY total DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    autenticar,
    cadastrar,
    atualizarFavorito,
    buscarFavoritoPorUsuario,
    buscarTodosFavoritos
};