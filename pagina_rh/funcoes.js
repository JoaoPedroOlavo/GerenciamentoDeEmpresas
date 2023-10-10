function calcularTempoNaEmpresa(dataAdmissao) {
    const dataAdmissaoFuncionario = new Date(dataAdmissao);
    const dataAtual = new Date();

    const diffEmMilissegundos = dataAtual - dataAdmissaoFuncionario;

    const diffEmAnos = Math.floor(diffEmMilissegundos / (1000 * 60 * 60 * 24 * 365.25));
    diffEmMilissegundos -= diffEmAnos * 1000 * 60 * 60 * 24 * 365.25;

    const diffEmMeses = Math.floor(diffEmMilissegundos / (1000 * 60 * 60 * 24 * 30.44));
    diffEmMilissegundos -= diffEmMeses * 1000 * 60 * 60 * 24 * 30.44;

    const diffEmDias = Math.floor(diffEmMilissegundos / (1000 * 60 * 60 * 24));

    return `${diffEmAnos} anos, ${diffEmMeses} meses, ${diffEmDias} dias`;
}

module.exports = {
    calcularTempoNaEmpresa
};
