document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/filmes';
    const favoritos = [];

    // ELEMENTOS GERAIS
    const listaFilmes = document.getElementById('lista-filmes');
    const detalhesFilme = document.getElementById('detalhes-filme');
    const listaFilmesCrud = document.getElementById('lista-filmes-crud');
    const formFilme = document.getElementById('form-filme');
    const btnCancelar = document.getElementById('btn-cancelar');

    const inputId = document.getElementById('filme-id');
    const inputTitulo = document.getElementById('titulo');
    const inputDescricao = document.getElementById('descricao');
    const inputImagem = document.getElementById('imagem');
    const inputLancamento = document.getElementById('lancamento');
    const inputCategoria = document.getElementById('categoria');
    const inputDiretor = document.getElementById('diretor');
    const inputDuracao = document.getElementById('duracao');
    const inputFaixaEtaria = document.getElementById('faixa_etaria');

    // Função para rolar suavemente até o formulário
    function irParaFormulario() {
        formFilme.scrollIntoView({ behavior: 'smooth' });
    }

    // ---------- HOME: LISTA DE FILMES ----------
    if (listaFilmes) {
        fetch(API_URL)
            .then(response => response.json())
            .then(filmes => {
                filmes.forEach(filme => {
                    const card = document.createElement('div');
                    card.classList.add('col');

                    card.innerHTML = `
                        <div class="card h-100 movie-card">
                            <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                            <span class="favorite-icon" data-id="${filme.id}">♡</span>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${filme.titulo}</h5>
                                <p class="card-text">${filme.descricao}</p>
                                <div class="mt-auto">
                                    <a href="detalhes.html?id=${filme.id}" class="btn btn-warning mb-2">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>
                    `;
                    listaFilmes.appendChild(card);

                    // Atualizar estado do coração baseado nos favoritos salvos
                    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                    const heartIcon = card.querySelector('.favorite-icon');
                    
                    if (usuarioLogado) {
                        const favorites = JSON.parse(localStorage.getItem(`favoritos_${usuarioLogado.id}`)) || [];
                        if (favorites.includes(filme.id.toString())) {
                            heartIcon.classList.add('favorited');
                            heartIcon.textContent = '♥';
                        }
                    } else {
                        // Se não estiver logado, mostrar coração vazio
                        heartIcon.textContent = '♡';
                    }
                });

                const searchBar = document.getElementById('searchBar');
                if (searchBar) {
                    searchBar.addEventListener('keyup', function (event) {
                        const searchTerm = event.target.value.toLowerCase();
                        const cards = listaFilmes.querySelectorAll('.col');

                        cards.forEach(card => {
                            const titleElement = card.querySelector('.card-title');
                            const title = titleElement ? titleElement.textContent.toLowerCase() : '';

                            card.style.display = title.includes(searchTerm) ? '' : 'none';
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar filmes:', error);
                listaFilmes.innerHTML = `<p class="text-danger">Erro ao carregar filmes.</p>`;
            });
    }

    // ---------- DETALHES DO FILME ----------
    if (detalhesFilme) {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));

        fetch(`${API_URL}/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Filme não encontrado');
                return response.json();
            })
            .then(filme => {
                detalhesFilme.innerHTML = `
                    <div class="col-12 text-center mb-4">
                      <div class="d-flex justify-content-center align-items-center mb-3">
                        <h2 class="me-3 mb-0">${filme.titulo}</h2>
                        <span class="favorite-icon" data-id="${filme.id}" style="font-size: 32px; color: gray; cursor: pointer; transition: all 0.3s ease; user-select: none; padding: 8px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.9); width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.5);">♡</span>
                      </div>
                    </div>
                    <div class="col-md-6 text-center mb-4">
                      <img src="${filme.imagem}" alt="${filme.titulo}" class="img-fluid rounded shadow" style="max-height: 500px; width: auto;" />
                    </div>
                    <div class="col-md-6">
                      <div class="card h-100">
                        <div class="card-body">
                          <h5 class="card-title text-center mb-4">Informações do Filme</h5>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Descrição:</strong></div>
                            <div class="col-8">${filme.descricao}</div>
                          </div>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Lançamento:</strong></div>
                            <div class="col-8">${filme.lancamento}</div>
                          </div>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Categoria:</strong></div>
                            <div class="col-8">${Array.isArray(filme.categoria) ? filme.categoria.join(', ') : filme.categoria}</div>
                          </div>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Diretor:</strong></div>
                            <div class="col-8">${filme.diretor}</div>
                          </div>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Duração:</strong></div>
                            <div class="col-8">${filme.duracao}</div>
                          </div>
                          <div class="row mb-3">
                            <div class="col-4"><strong>Faixa Etária:</strong></div>
                            <div class="col-8">${filme.faixa_etaria}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Erro ao carregar detalhes do filme:', error);
                detalhesFilme.innerHTML = `<p class="text-danger">Filme não encontrado.</p>`;
            });
    }

    // ---------- FAVORITOS (EVENTO GLOBAL) ----------
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-favoritar')) {
            const titulo = event.target.closest('.card-body')?.querySelector('.card-title')?.textContent
                        || event.target.closest('.col-md-6.text-start')?.querySelector('h2')?.textContent;

            if (titulo && !favoritos.includes(titulo)) {
                favoritos.push(titulo);
                alert(`"${titulo}" foi adicionado aos favoritos!`);
            } else if (titulo) {
                alert(`"${titulo}" já está nos favoritos.`);
            }
        }
    });

    // ---------- CRUD ----------
    async function carregarFilmesCrud() {
        try {
            const res = await fetch(API_URL);
            const filmes = await res.json();

            listaFilmesCrud.innerHTML = "";

            if (filmes.length === 0) {
                listaFilmesCrud.innerHTML = "<p>Nenhum filme cadastrado.</p>";
                return;
            }

            filmes.forEach(filme => {
                const col = document.createElement("div");
                col.className = "col";

                col.innerHTML = `
                    <div class="card h-100">
                        <img src="${filme.imagem || 'https://via.placeholder.com/150x200?text=Sem+Imagem'}" class="card-img-top" alt="${filme.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${filme.titulo}</h5>
                            <p class="card-text">${filme.descricao}</p>
                            <p><strong>Lançamento:</strong> ${filme.lancamento || "-"}</p>
                            <p><strong>Categoria:</strong> ${filme.categoria || "-"}</p>
                            <p><strong>Diretor:</strong> ${filme.diretor || "-"}</p>
                            <p><strong>Duração:</strong> ${filme.duracao || "-"}</p>
                            <p><strong>Faixa Etária:</strong> ${filme.faixa_etaria || "-"}</p>
                            <button class="btn btn-sm btn-warning me-2 btn-editar" data-id="${filme.id}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-excluir" data-id="${filme.id}">Excluir</button>
                        </div>
                    </div>
                `;

                listaFilmesCrud.appendChild(col);
            });

            document.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", () => {
                    carregarFilmeParaEditar(btn.dataset.id);
                });
            });

            document.querySelectorAll(".btn-excluir").forEach(btn => {
                btn.addEventListener("click", () => {
                    excluirFilme(btn.dataset.id);
                });
            });

        } catch (error) {
            console.error("Erro ao carregar filmes:", error);
        }
    }

    async function carregarFilmeParaEditar(id) {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Filme não encontrado");
            const filme = await res.json();

            inputId.value = filme.id;
            inputTitulo.value = filme.titulo;
            inputDescricao.value = filme.descricao;
            inputImagem.value = filme.imagem || "";
            inputLancamento.value = filme.lancamento || "";
            inputCategoria.value = filme.categoria || "";
            inputDiretor.value = filme.diretor || "";
            inputDuracao.value = filme.duracao || "";
            inputFaixaEtaria.value = filme.faixa_etaria || "";

            // Rola para o formulário
            irParaFormulario();

        } catch (error) {
            alert("Erro ao carregar filme para edição.");
            console.error(error);
        }
    }

    async function excluirFilme(id) {
        if (!confirm("Deseja realmente excluir este filme?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir filme");
            carregarFilmesCrud();
        } catch (error) {
            alert("Erro ao excluir filme.");
            console.error(error);
        }
    }

    function limparFormulario() {
        inputId.value = "";
        formFilme.reset();
    }

    if (formFilme) {
        formFilme.addEventListener("submit", async (e) => {
            e.preventDefault();

            const filmeData = {
                titulo: inputTitulo.value,
                descricao: inputDescricao.value,
                imagem: inputImagem.value,
                lancamento: inputLancamento.value,
                categoria: inputCategoria.value,
                diretor: inputDiretor.value,
                duracao: inputDuracao.value,
                faixa_etaria: inputFaixaEtaria.value,
            };

            try {
                if (inputId.value) {
                    const res = await fetch(`${API_URL}/${inputId.value}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(filmeData),
                    });
                    if (!res.ok) throw new Error("Erro ao atualizar filme");
                } else {
                    const res = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(filmeData),
                    });
                    if (!res.ok) throw new Error("Erro ao criar filme");
                }

                limparFormulario();
                carregarFilmesCrud();
            } catch (error) {
                alert("Erro ao salvar filme.");
                console.error(error);
            }
        });

        btnCancelar.addEventListener("click", (e) => {
            e.preventDefault();
            limparFormulario();
        });

        // Inicializa lista CRUD se existir na página
        carregarFilmesCrud();
    }
});