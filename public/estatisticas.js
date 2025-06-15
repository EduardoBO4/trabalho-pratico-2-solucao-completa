
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/filmes';
    
    // Verificar se veio da página de favoritos
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const isFavoritos = tipo === 'favoritos';
    
    // Atualizar títulos baseado no tipo
    if (isFavoritos) {
        document.getElementById('titulo-estatisticas').textContent = 'Estatísticas dos Seus Favoritos';
        document.getElementById('subtitulo-estatisticas').textContent = 'Análise dos filmes que você marcou como favoritos';
    }

    async function carregarDados() {
        try {
            const response = await fetch(API_URL);
            let filmes = await response.json();
            
            // Se for favoritos, filtrar apenas os favoritos do usuário
            if (isFavoritos) {
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                if (usuarioLogado) {
                    const favorites = JSON.parse(localStorage.getItem(`favoritos_${usuarioLogado.id}`)) || [];
                    filmes = filmes.filter(filme => favorites.includes(filme.id.toString()));
                } else {
                    filmes = [];
                }
            }
            
            if (filmes.length === 0) {
                document.querySelector('.container').innerHTML = `
                    <div class="text-center">
                        <h3>Nenhum filme encontrado</h3>
                        <p>${isFavoritos ? 'Você ainda não possui filmes favoritos.' : 'Não há filmes no catálogo.'}</p>
                        <button onclick="history.back()" class="btn btn-primary">← Voltar</button>
                    </div>
                `;
                return;
            }
            
            gerarEstatisticas(filmes);
        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
            document.querySelector('.container').innerHTML = `
                <div class="text-center text-danger">
                    <h3>Erro ao carregar dados</h3>
                    <p>Não foi possível carregar as estatísticas.</p>
                    <button onclick="history.back()" class="btn btn-primary">← Voltar</button>
                </div>
            `;
        }
    }

    function gerarEstatisticas(filmes) {
        // Processar dados para gêneros
        const generos = {};
        filmes.forEach(filme => {
            if (Array.isArray(filme.categoria)) {
                filme.categoria.forEach(genero => {
                    generos[genero] = (generos[genero] || 0) + 1;
                });
            } else if (typeof filme.categoria === 'string') {
                // Fallback para formato antigo
                const generosFilme = filme.categoria.split(',').map(g => g.trim());
                generosFilme.forEach(genero => {
                    generos[genero] = (generos[genero] || 0) + 1;
                });
            }
        });

        // Processar dados para anos
        const anos = {};
        filmes.forEach(filme => {
            let ano = filme.lancamento;
            if (typeof ano === 'string') {
                // Extrair apenas o ano se for string
                const match = ano.match(/\d{4}/);
                ano = match ? match[0] : 'Indefinido';
            }
            anos[ano] = (anos[ano] || 0) + 1;
        });

        // Processar dados para faixa etária
        const faixasEtarias = {};
        filmes.forEach(filme => {
            const faixa = filme.faixa_etaria || 'Indefinido';
            faixasEtarias[faixa] = (faixasEtarias[faixa] || 0) + 1;
        });

        // Gerar gráficos
        gerarGraficoGeneros(generos);
        gerarGraficoAnos(anos);
        gerarGraficoFaixaEtaria(faixasEtarias);
        gerarResumoNumerico(filmes, generos, anos, faixasEtarias);
    }

    function gerarGraficoGeneros(generos) {
        const ctx = document.getElementById('graficoGeneros').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(generos),
                datasets: [{
                    data: Object.values(generos),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function gerarGraficoAnos(anos) {
        const ctx = document.getElementById('graficoAnos').getContext('2d');
        
        // Ordenar anos
        const anosOrdenados = Object.keys(anos).sort();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: anosOrdenados,
                datasets: [{
                    label: 'Número de Filmes',
                    data: anosOrdenados.map(ano => anos[ano]),
                    backgroundColor: '#36A2EB',
                    borderColor: '#1E88E5',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    function gerarGraficoFaixaEtaria(faixasEtarias) {
        const ctx = document.getElementById('graficoFaixaEtaria').getContext('2d');
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(faixasEtarias),
                datasets: [{
                    data: Object.values(faixasEtarias),
                    backgroundColor: [
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function gerarResumoNumerico(filmes, generos, anos, faixasEtarias) {
        const totalFilmes = filmes.length;
        const totalGeneros = Object.keys(generos).length;
        const generoMaisPopular = Object.keys(generos).reduce((a, b) => generos[a] > generos[b] ? a : b);
        const anoMaisRecente = Math.max(...Object.keys(anos).filter(ano => ano !== 'Indefinido').map(Number));
        const anoMaisAntigo = Math.min(...Object.keys(anos).filter(ano => ano !== 'Indefinido').map(Number));

        document.getElementById('resumo-numerico').innerHTML = `
            <div class="row">
                <div class="col-6 mb-3">
                    <div class="border-start border-primary border-4 ps-3">
                        <h6 class="text-muted mb-1">Total de Filmes</h6>
                        <h4 class="mb-0">${totalFilmes}</h4>
                    </div>
                </div>
                <div class="col-6 mb-3">
                    <div class="border-start border-success border-4 ps-3">
                        <h6 class="text-muted mb-1">Gêneros Diferentes</h6>
                        <h4 class="mb-0">${totalGeneros}</h4>
                    </div>
                </div>
                <div class="col-12 mb-3">
                    <div class="border-start border-warning border-4 ps-3">
                        <h6 class="text-muted mb-1">Gênero Mais Popular</h6>
                        <h5 class="mb-0">${generoMaisPopular} (${generos[generoMaisPopular]} filmes)</h5>
                    </div>
                </div>
                <div class="col-6 mb-3">
                    <div class="border-start border-info border-4 ps-3">
                        <h6 class="text-muted mb-1">Filme Mais Antigo</h6>
                        <h5 class="mb-0">${anoMaisAntigo}</h5>
                    </div>
                </div>
                <div class="col-6 mb-3">
                    <div class="border-start border-danger border-4 ps-3">
                        <h6 class="text-muted mb-1">Filme Mais Recente</h6>
                        <h5 class="mb-0">${anoMaisRecente}</h5>
                    </div>
                </div>
            </div>
        `;
    }

    // Inicializar
    carregarDados();
});
