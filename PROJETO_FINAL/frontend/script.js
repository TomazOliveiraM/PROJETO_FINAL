// --- Seletores de Elementos ---
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const profileContainer = document.getElementById('profile-container');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

const sortByDateBtn = document.getElementById('sort-by-date-btn');
const sortByPriorityBtn = document.getElementById('sort-by-priority-btn');
const searchInput = document.getElementById('search-input');

const profileBtn = document.getElementById('profile-btn');
const backToTasksBtn = document.getElementById('back-to-tasks-btn');

const logoutBtn = document.getElementById('logout-btn');

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');

const API_URL = '/api/tasks';
const AUTH_URL = '/api/auth';
const USER_URL = '/api/users';

// --- Estado da Aplicação ---
let currentSortBy = 'date';
let currentSearchTerm = '';
let searchDebounceTimer;

// --- Funções de UI ---
function showLoginView() {
  authContainer.style.display = 'block';
  appContainer.style.display = 'none';
  profileContainer.style.display = 'none';
  loginView.style.display = 'block';
  registerView.style.display = 'none';
}

function showAppView() {
  authContainer.style.display = 'none';
  profileContainer.style.display = 'none';
  appContainer.style.display = 'block';
  fetchTasks();
}

function showProfileView() {
  authContainer.style.display = 'none';
  appContainer.style.display = 'none';
  profileContainer.style.display = 'block';
  fetchProfileData();
}

// --- Funções da Aplicação (Tarefas) ---
function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    const priority = task.priority || 'média';
    
    li.dataset.id = task._id;
    li.classList.add(`priority-${priority}`);

    if (task.completed) {
      li.classList.add('completed');
    }

    li.innerHTML = `
      <div class="task-content">
        <span class="task-title">${task.title}</span>
        <span class="task-description">${task.description || ''}</span>
        <span class="task-date">Criada em: ${new Date(task.createdAt).toLocaleString('pt-BR')}</span>
      </div>
      <div class="task-controls">
        <span class="task-priority">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
        <button class="toggle-btn" data-id="${task._id}">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
        <button class="edit-btn" data-id="${task._id}">Editar</button>
        <button class="delete-btn" data-id="${task._id}">Excluir</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// READ: Carregar tarefas ao iniciar a página
async function fetchTasks() {
  const token = localStorage.getItem('token');
  if (!token) return showLoginView();

  const queryParams = new URLSearchParams({
    sortBy: currentSortBy,
  });

  if (currentSearchTerm) {
    queryParams.append('search', currentSearchTerm);
  }

  try {
    const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
      headers: { 'x-auth-token': token }
    });
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
}

// CREATE: Adicionar nova tarefa
async function addTask(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = titleInput.value;
  const description = descriptionInput.value;
  const priority = priorityInput.value;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description, priority }),
    });

    if (res.ok) {
      taskForm.reset();
      fetchTasks();
    } else {
      alert('Erro ao adicionar tarefa.');
    }
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
  }
}

// UPDATE: Marcar como concluída/não concluída
async function toggleComplete(id) {
  const token = localStorage.getItem('token');
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'x-auth-token': token }
    });
    fetchTasks();
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
}

// UPDATE: Editar o conteúdo de uma tarefa
function handleEdit(id) {
  const li = document.querySelector(`li[data-id='${id}']`);
  const taskContent = li.querySelector('.task-content');
  const currentTitle = taskContent.querySelector('.task-title').textContent;
  const currentDescription = taskContent.querySelector('.task-description').textContent;

  // Substitui o conteúdo da tarefa por um formulário de edição
  taskContent.innerHTML = `
    <form class="edit-form" data-id="${id}">
      <input type="text" class="edit-title" value="${currentTitle}" required>
      <input type="text" class="edit-description" value="${currentDescription}" placeholder="Descrição">
      <button type="submit" class="save-btn">Salvar</button>
      <button type="button" class="cancel-btn">Cancelar</button>
    </form>
  `;

  // Oculta os controles principais
  li.querySelector('.task-controls').style.display = 'none';
}

async function handleSave(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.dataset.id;
  const title = form.querySelector('.edit-title').value;
  const description = form.querySelector('.edit-description').value;
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description })
    });

    if (res.ok) {
      fetchTasks(); // Re-renderiza a lista para sair do modo de edição
    } else {
      const data = await res.json();
      alert(`Erro ao salvar: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao salvar tarefa:', error);
  }
}

// DELETE: Excluir tarefa
async function deleteTask(id) {
  const token = localStorage.getItem('token');
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    fetchTasks();
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
  }
}

// Exportar para JSON
window.exportTasks = async function() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(API_URL, {
      headers: { 'x-auth-token': token }
    });
    const tasks = await response.json();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'tarefas.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Erro ao exportar tarefas:', error);
  }
}

// --- Funções do Perfil ---
async function fetchProfileData() {
  const token = localStorage.getItem('token');
  if (!token) return showLoginView();

  try {
    const res = await fetch(`${USER_URL}/profile`, {
      headers: { 'x-auth-token': token }
    });
    if (res.ok) {
      const data = await res.json();
      renderProfileData(data);
    } else {
      alert('Erro ao buscar dados do perfil.');
      showAppView();
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
  }
}

function renderProfileData(data) {
  document.getElementById('profile-username').textContent = data.username;
  document.getElementById('profile-member-since').textContent = `Membro desde: ${new Date(data.memberSince).toLocaleDateString()}`;

  const { stats } = data;
  document.getElementById('stat-total').textContent = stats.totalTasks;
  document.getElementById('stat-completed').textContent = stats.completedTasks;
  document.getElementById('stat-pending').textContent = stats.pendingTasks;
  document.getElementById('stat-priority-high').textContent = stats.priorities.alta || 0;
  document.getElementById('stat-priority-medium').textContent = stats.priorities.média || 0;
  document.getElementById('stat-priority-low').textContent = stats.priorities.baixa || 0;
}


// --- Funções de Autenticação ---
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showAppView();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Erro de login:', error);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      showLoginView();
    }
  } catch (error) {
    console.error('Erro de registro:', error);
  }
}

async function handleLogout() {
  const token = localStorage.getItem('token');
  if (!token) {
    return showLoginView();
  }

  try {
    await fetch(`${AUTH_URL}/logout`, {
      method: 'POST',
      headers: { 'x-auth-token': token }
    });
  } catch (error) {
    // Mesmo que a chamada falhe, o logout no frontend deve continuar
    console.error('Erro ao fazer logout no servidor:', error);
  } finally {
    // Limpa o token local e mostra a tela de login
    localStorage.removeItem('token');
    showLoginView();
  }
}

// --- Event Listeners ---
showRegisterLink.addEventListener('click', () => {
  loginView.style.display = 'none';
  registerView.style.display = 'block';
});

showLoginLink.addEventListener('click', () => {
  loginView.style.display = 'block';
  registerView.style.display = 'none';
});

sortByDateBtn.addEventListener('click', () => {
  currentSortBy = 'date';
  sortByDateBtn.classList.add('active');
  sortByPriorityBtn.classList.remove('active');
  fetchTasks();
});

sortByPriorityBtn.addEventListener('click', () => {
  currentSortBy = 'priority';
  sortByPriorityBtn.classList.add('active');
  sortByDateBtn.classList.remove('active');
  fetchTasks();
});

profileBtn.addEventListener('click', showProfileView);
backToTasksBtn.addEventListener('click', showAppView);

searchInput.addEventListener('input', (e) => {
  // Debounce para evitar requisições excessivas à API
  clearTimeout(searchDebounceTimer);
  currentSearchTerm = e.target.value;
  searchDebounceTimer = setTimeout(() => {
    fetchTasks();
  }, 300); // Aguarda 300ms após o usuário parar de digitar
});

loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
taskForm.addEventListener('submit', addTask);

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-btn')) {
    toggleComplete(e.target.dataset.id);
  }
  if (e.target.classList.contains('delete-btn')) {
    deleteTask(e.target.dataset.id);
  }
  if (e.target.classList.contains('edit-btn')) {
    handleEdit(e.target.dataset.id);
  }
  if (e.target.classList.contains('cancel-btn')) {
    fetchTasks(); // Simplesmente recarrega a lista para cancelar
  }
});

// --- Inicialização ---
// Adiciona um listener para o evento 'submit', que é o correto para formulários.
// Isso garante que a função handleSave seja chamada quando o formulário de edição for enviado.
taskList.addEventListener('submit', (e) => {
  if (e.target.classList.contains('edit-form')) {
    handleSave(e);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    showAppView();
  } else {
    showLoginView();
  }
});