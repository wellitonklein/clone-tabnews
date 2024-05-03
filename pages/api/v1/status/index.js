function status(request, response) {
    response
        .status(200)
        .json({ "chave": "alunos do curso.dev sao acima da média" });
}

export default status;