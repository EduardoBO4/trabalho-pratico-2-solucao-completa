// Script de controle de autenticação
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se usuário está logado
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  
  // Atualizar menu baseado no status de login
  atualizarMenu(usuarioLogado);
  
  // Adicionar listener para logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});

function atualizarMenu(usuario) {
  const menuLogin = document.getElementById('menu-login');
  const menuLogout = document.getElementById('menu-logout');
  const menuFavoritos = document.getElementById('menu-favoritos');
  const nomeUsuario = document.getElementById('nome-usuario');
  
  // Menu desktop
  const menuLoginDesktop = document.getElementById('menu-login-desktop');
  const menuLogoutDesktop = document.getElementById('menu-logout-desktop');
  const menuFavoritosDesktop = document.getElementById('menu-favoritos-desktop');
  const nomeUsuarioDesktop = document.getElementById('nome-usuario-desktop');

  if (usuario) {
    // Usuário logado - mostrar logout e favoritos
    if (menuLogin) menuLogin.style.display = 'none';
    if (menuLogout) menuLogout.style.display = 'block';
    if (menuFavoritos) menuFavoritos.style.display = 'block';
    if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
    
    // Desktop
    if (menuLoginDesktop) menuLoginDesktop.style.display = 'none';
    if (menuLogoutDesktop) menuLogoutDesktop.style.display = 'block';
    if (menuFavoritosDesktop) menuFavoritosDesktop.style.display = 'block';
    if (nomeUsuarioDesktop) nomeUsuarioDesktop.textContent = usuario.nome;
  } else {
    // Usuário não logado - mostrar login, esconder favoritos
    if (menuLogin) menuLogin.style.display = 'block';
    if (menuLogout) menuLogout.style.display = 'none';
    if (menuFavoritos) menuFavoritos.style.display = 'none';
    
    // Desktop
    if (menuLoginDesktop) menuLoginDesktop.style.display = 'block';
    if (menuLogoutDesktop) menuLogoutDesktop.style.display = 'none';
    if (menuFavoritosDesktop) menuFavoritosDesktop.style.display = 'none';
  }
}

function logout() {
  sessionStorage.removeItem('usuarioLogado');
  localStorage.removeItem('favoritos'); // Limpar favoritos ao fazer logout
  window.location.href = 'index.html';
}

function verificarLogin() {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  return usuario !== null;
}

function obterUsuarioLogado() {
  return JSON.parse(sessionStorage.getItem('usuarioLogado'));
}

function redirecionarSeNaoLogado() {
  if (!verificarLogin()) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
