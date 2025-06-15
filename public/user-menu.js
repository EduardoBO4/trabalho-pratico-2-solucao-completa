
document.addEventListener('DOMContentLoaded', () => {
  const userIcon = document.getElementById('user-icon');
  const userMenu = document.getElementById('user-menu');
  const userInfoDisplay = document.getElementById('user-info-display');
  const userNameDisplay = document.getElementById('user-name-display');
  const loginMenuItem = document.getElementById('login-menu-item');
  const registerMenuItem = document.getElementById('register-menu-item');
  const favoritesMenuItem = document.getElementById('favorites-menu-item');
  const logoutMenuItem = document.getElementById('logout-menu-item');
  const favoritesBtn = document.getElementById('favorites-btn');

  // Toggle do menu
  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target) && !userIcon.contains(e.target)) {
      userMenu.classList.remove('show');
    }
  });

  // Logout
  logoutMenuItem.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
      logout();
    }
    userMenu.classList.remove('show');
  });

  // Atualizar interface baseado no login
  function updateUserInterface() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (usuarioLogado) {
      // Usuário logado
      userInfoDisplay.style.display = 'block';
      userNameDisplay.textContent = usuarioLogado.nome;
      loginMenuItem.style.display = 'none';
      registerMenuItem.style.display = 'none';
      favoritesMenuItem.style.display = 'block';
      logoutMenuItem.style.display = 'block';
      favoritesBtn.classList.remove('hidden');
    } else {
      // Usuário não logado
      userInfoDisplay.style.display = 'none';
      loginMenuItem.style.display = 'block';
      registerMenuItem.style.display = 'block';
      favoritesMenuItem.style.display = 'none';
      logoutMenuItem.style.display = 'none';
      favoritesBtn.classList.add('hidden');
    }
  }

  // Inicializar interface
  updateUserInterface();

  // Observar mudanças no sessionStorage
  window.addEventListener('storage', updateUserInterface);
  
  // Para mudanças na mesma aba
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'usuarioLogado') {
      updateUserInterface();
    }
  };
});
