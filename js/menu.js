const LOGIN_PAGE_URL = 'login.html';
const API_USERS_URL = 'http://localhost:5001/users';
const LOCAL_STORAGE_KEY = 'user';

// MENU:
function toggleMenu(id) {

    const menu = document.getElementById(id);
    
    menu.classList.toggle('hide');

}

// MOSTRAR NOME DE USUARIO:
function displayUsername() {
    
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const nameElement = document.getElementById('username-display');
    const user = JSON.parse(userString);

    nameElement.textContent = user.username;

}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(displayUsername, 50); 
});

// REDIRECIONAR:
function cleanupAndRedirect() {

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    window.location.href = LOGIN_PAGE_URL;

}

// DELETAR USUARIO:
async function deleteUser() {
    
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    let user = JSON.parse(userString);
    
    const confirmDelete = confirm(`Tem certeza que deseja EXCLUIR a conta de ${user.username}? Esta ação é IRREVERSÍVEL.`);
    
    if (!confirmDelete) {
        return;
    }

    try {
        
        const response = await fetch(
            `${API_USERS_URL}/${user.id}`,
            {method: 'DELETE'}
        );

        alert(`Conta do usuário ${user.username} excluída com sucesso do servidor.`);
            
        cleanupAndRedirect();

    } catch (error) {

        alert('Não foi possível conectar ao servidor para excluir a conta.');

    }

}
