const postModel = require("../models/postModel");

function listar(req, res) {
    postModel.listar().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPorUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

    postModel.listarPorUsuario(idUsuario)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    return res.status(200).json(resultado[0]);
                } else {
                    return res.status(204).send();
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "Houve um erro ao buscar os avisos: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function pesquisarDescricao(req, res) {
    const descricao = req.params.descricao;

    avisoModel.pesquisarDescricao(descricao)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function publicar(req, res) {
    const titulo = req.body.titulo;
    const conteudo = req.body.conteudo;
    const autor_id = req.params.idUsuario;

    if (titulo == undefined) {
        res.status(400).send("O título está indefinido!");
    } else if (conteudo == undefined) {
        res.status(400).send("A descrição está indefinido!");
    } else if (autor_id == undefined) {
        res.status(403).send("O id do usuário está indefinido!");
    } else {
        postModel.publicar(titulo, conteudo, autor_id)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function publicarComentario(req, res) {
    const autor_id = req.body.usuario
    const conteudo = req.body.conteudo;
    const post_id = req.params.idPost;

    if (autor_id == undefined) {
        res.status(400).send("O usuario está indefinido!");
    } else if (conteudo == undefined) {
        res.status(400).send("O conteudo está indefinido!");
    } else if (post_id == undefined) {
        res.status(403).send("O id do post está indefinido!");
    } else {
        postModel.publicarComentario(conteudo, autor_id, post_id)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function editar(req, res) {
    const novaDescricao = req.body.descricao;
    const idAviso = req.params.idAviso;

    avisoModel.editar(novaDescricao, idAviso)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function deletar(req, res) {
    const idAviso = req.params.idAviso;

    avisoModel.deletar(idAviso)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    listar,
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    publicarComentario,
    editar,
    deletar
}