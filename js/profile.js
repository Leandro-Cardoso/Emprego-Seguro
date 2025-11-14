document.addEventListener('DOMContentLoaded', () => {
    loadVendedorProfile();
});

async function loadVendedorProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    const loadingMessage = document.getElementById('loading-message');
    const detailsContainer = document.getElementById('vendedor-details');
    const errorMessage = document.getElementById('error-message');
    const usernameDisplay = document.getElementById('vendedor-username');

    if (!userId) {
        usernameDisplay.textContent = 'Erro';
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'ID do vendedor não fornecido na URL.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const requestUrl = `${API_USERS_URL}/${userId}`;
        const response = await fetch(requestUrl, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`Erro de rede ou usuário não encontrado: ${response.status}`);
        }

        const user = await response.json();
        
        usernameDisplay.textContent = user.username;
        document.getElementById('vendedor-email').textContent = user.email;
        document.getElementById('vendedor-phone').textContent = user.phone;
        document.getElementById('vendedor-location').textContent = user.location;
        document.getElementById('vendedor-description').textContent = user.description || 'Nenhuma descrição fornecida.';
        
        const messageButton = document.getElementById('message-button');
        messageButton.textContent = `Enviar Mensagem`;
        
        messageButton.onclick = () => {
             window.location.href = `send-message.html?receiverId=${user.id}&receiverUsername=${user.username}`;
        };

        loadingMessage.style.display = 'none';
        detailsContainer.style.display = 'flex';

    } catch (error) {
        console.error('Falha ao buscar dados do vendedor:', error);
        usernameDisplay.textContent = 'Perfil Indisponível';
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'Não foi possível carregar as informações do vendedor.';
        errorMessage.style.display = 'block';
    }
}
