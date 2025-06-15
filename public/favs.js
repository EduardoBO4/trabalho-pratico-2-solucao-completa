document.addEventListener('DOMContentLoaded', () => {
  const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];

  // Atualiza os ícones de favoritos na página (index ou outra)
  document.querySelectorAll('.favorite-icon').forEach(icon => {
    const id = icon.dataset.id.toString();
    if (favorites.includes(id)) {
      icon.classList.add('favorited');
      icon.textContent = '♥'; // Coração cheio
    } else {
      icon.textContent = '♡'; // Coração vazio
    }
  });

  // Evento de clique nos ícones de favoritos
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('favorite-icon')) {
      e.preventDefault();
      e.stopPropagation();

      const icon = e.target;
      const id = icon.dataset.id.toString();
      const index = favorites.indexOf(id);

      if (index > -1) {
        favorites.splice(index, 1); // Remove dos favoritos
        icon.classList.remove('favorited');
        icon.textContent = '♡';
      } else {
        favorites.push(id); // Adiciona aos favoritos
        icon.classList.add('favorited');
        icon.textContent = '♥';
      }

      // Atualiza o localStorage
      localStorage.setItem('favoritos', JSON.stringify(favorites));
      console.log('Favoritos atualizados:', favorites);
    }
  });

  // Se estiver na página de favoritos, renderiza os filmes
  if (document.getElementById('lista-favoritos')) {
    renderFavoritos();
  }
});

async function renderFavoritos() {
  const lista = document.getElementById('lista-favoritos');
  const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];

  // Buscar filmes da API
  let filmes = [];
  try {
    const response = await fetch('http://localhost:3000/filmes');
    filmes = await response.json();
  } catch (error) {
    console.error('Erro ao carregar filmes da API:', error);
    // Fallback para filmes estáticos se a API não estiver disponível
    filmes = [
      {
        id: '1',
        titulo: 'Vingadores: Ultimato',
        descricao: 'O destino do universo será decidido… por aqueles que não desistem.',
        imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0Qa5bq0YghBRrJeOtiCnlbrvow82asTb1fz3tk-ySUBx5cXAosfjhMi-dFnDGQsmOxjlgToTxm7fV-tadzxTdCpHikWERusa6W6qyUiv8nXzbZavRJ-MY3ZDCvcmbnhKLVgFrX3BHwcEt/s1600/Vingadores_Ultimato_Marvel+Studios+%25281%2529.jpg'
      },
      {
        id: '2',
        titulo: 'Up - Altas Aventuras',
        descricao: 'As maiores aventuras começam com um simples "olá".',
        imagem: 'https://recreio.com.br/media/uploads/2024/10/up-altas-aventuras_capa-1.jpg'
      },
      {
        id: '3',
        titulo: 'WALL-E',
        descricao: 'Às vezes, é preciso olhar para o que perdemos para redescobrir o que realmente importa.',
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSVllaogQpeZY-E2EK4k9_s2MbCyfbxtl1A&s'
      }
    ];
  }

  const filmesFavoritos = filmes.filter(filme => favorites.includes(filme.id));

  if (filmesFavoritos.length === 0) {
    lista.innerHTML = `<p class="text-center">Nenhum filme favorito adicionado ainda.</p>`;
    return;
  }

  lista.innerHTML = filmesFavoritos.map(filme => `
    <div class="col">
      <div class="card h-100">
        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
        <div class="card-body">
          <h5 class="card-title">${filme.titulo}</h5>
          <p class="card-text">${filme.descricao}</p>
          <a href="detalhes.html?id=${filme.id}" class="btn btn-warning">Ver Detalhes</a>
        </div>
      </div>
    </div>
  `).join('');
}