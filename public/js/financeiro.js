document.addEventListener('DOMContentLoaded', function () {
    // Configuração do gráfico de tipos de transação
    var ctxTipoTransacao = document.getElementById('graficoTipoTransacao').getContext('2d');
    var tiposTransacao = [...new Set(dadosFinanceiros.map(transacao => transacao.tipo_transacao))];
    var contagemTiposTransacao = tiposTransacao.map(tipo => dadosFinanceiros.filter(transacao => transacao.tipo_transacao === tipo).length);

    new Chart(ctxTipoTransacao, {
        type: 'bar',
        data: {
            labels: tiposTransacao,
            datasets: [{
                label: 'Contagem por Tipo de Transação',
                data: contagemTiposTransacao,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Configuração do gráfico de valor de transação
    var ctxValorTransacao = document.getElementById('graficoValorTransacao').getContext('2d');
    var valoresTransacao = dadosFinanceiros.map(transacao => transacao.valor_transacao);

    new Chart(ctxValorTransacao, {
        type: 'bar',
        data: {
            labels: tiposTransacao,
            datasets: [{
                label: 'Valor por Tipo de Transação',
                data: valoresTransacao,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});
