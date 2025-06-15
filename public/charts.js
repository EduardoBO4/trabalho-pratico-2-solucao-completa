
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/filmes';

    // Função para criar gráfico de gêneros
    async function criarGraficoGeneros() {
        try {
            const response = await fetch(API_URL);
            const filmes = await response.json();

            // Contar filmes por gênero
            const generosCount = {};
            filmes.forEach(filme => {
                if (filme.categoria) {
                    const genero = filme.categoria.trim();
                    generosCount[genero] = (generosCount[genero] || 0) + 1;
                }
            });

            // Preparar dados para o gráfico
            const labels = Object.keys(generosCount);
            const data = Object.values(generosCount);
            
            // Cores para o gráfico de pizza
            const cores = [
                '#ff6600', '#cc5200', '#ff8533', '#ffad66', '#e55a00',
                '#b34700', '#ff9933', '#ffcc99', '#d84d00', '#ffc299'
            ];

            const ctx = document.getElementById('generoChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: cores.slice(0, labels.length),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.parsed / total) * 100);
                                    return `${context.label}: ${context.parsed} filmes (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao criar gráfico de gêneros:', error);
        }
    }

    // Função para criar gráfico de anos
    async function criarGraficoAnos() {
        try {
            const response = await fetch(API_URL);
            const filmes = await response.json();

            // Contar filmes por ano
            const anosCount = {};
            filmes.forEach(filme => {
                if (filme.lancamento) {
                    const ano = filme.lancamento.trim();
                    // Verificar se é um ano válido (4 dígitos)
                    if (/^\d{4}$/.test(ano)) {
                        anosCount[ano] = (anosCount[ano] || 0) + 1;
                    }
                }
            });

            // Ordenar anos em ordem crescente
            const anosOrdenados = Object.keys(anosCount).sort((a, b) => parseInt(a) - parseInt(b));
            const dadosOrdenados = anosOrdenados.map(ano => anosCount[ano]);

            const ctx = document.getElementById('anoChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: anosOrdenados,
                    datasets: [{
                        label: 'Número de Filmes',
                        data: dadosOrdenados,
                        backgroundColor: '#ff6600',
                        borderColor: '#cc5200',
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y} filme${context.parsed.y !== 1 ? 's' : ''}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    size: 12
                                }
                            },
                            title: {
                                display: true,
                                text: 'Quantidade de Filmes',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 12
                                }
                            },
                            title: {
                                display: true,
                                text: 'Ano de Lançamento',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao criar gráfico de anos:', error);
        }
    }

    // Criar os gráficos quando a página carregar
    criarGraficoGeneros();
    criarGraficoAnos();
});
