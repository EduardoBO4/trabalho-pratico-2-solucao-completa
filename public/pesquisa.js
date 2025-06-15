document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search');           // id correto
  const listaFilmes = document.getElementById('lista-filmes');   // id correto

  if (!searchBar || !listaFilmes) {
    console.warn('Elemento searchBar ou listaFilmes não encontrado');
    return;
  }

  searchBar.addEventListener('input', () => {
    const termo = searchBar.value.toLowerCase().trim();
    console.log('Pesquisando:', termo);

    const cards = listaFilmes.querySelectorAll('.col');   // Verifique se os cards têm a classe 'col'
    cards.forEach(card => {
      const titulo = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const descricao = card.querySelector('.card-text')?.textContent.toLowerCase() || '';

      if (termo === '' || titulo.includes(termo) || descricao.includes(termo)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
