// MENU:
function toggleMenu(id) {

    const menu = document.getElementById(id);
    
    menu.classList.toggle('hide');

}

// CHAT:
async function updateUnreadCount() {

    const counterElement = document.getElementById('counter-mensages');
    const chatRedElement = document.getElementById('chat-red');
    const chatBlueElement = document.getElementById('chat-blue');
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const currentUserId = user.id;
    const response = await fetch(API_MESSAGES_URL, { method: 'GET' });
    const allMessages = await response.json();

    const unreadCount = allMessages.filter(message => 
        message.receiver_id === currentUserId && message.read === false
    ).length;

    if (unreadCount > 0) {

        counterElement.textContent = unreadCount;

        chatRedElement.classList.remove('hide');
        chatBlueElement.classList.add('hide');
        
    } else {

        counterElement.textContent = '';

        chatRedElement.classList.add('hide');
        chatBlueElement.classList.remove('hide');
        
    }

}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateUnreadCount, 50);
});

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

    const allServicesResponse = await fetch(
        API_SERVICES_URL,
        { method: 'GET' }
    );
    
    const allServices = await allServicesResponse.json(); 
    const userServices = allServices.filter(service => service.user_id === user.id);

    if (userServices && userServices.length > 0) {
        
        const deletePromises = userServices.map(service => {
            return fetch(
                `${API_SERVICES_URL}/${service.id}`,
                { method: 'DELETE' }
            );
        });
        
        await Promise.all(deletePromises);

    }

    const response = await fetch(
        `${API_USERS_URL}/${user.id}`,
        {method: 'DELETE'}
    );

    alert(`Conta do usuário ${user.username} excluída com sucesso do servidor.`);
        
    cleanupAndRedirect();

}
