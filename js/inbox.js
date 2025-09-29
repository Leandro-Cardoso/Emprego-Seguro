const usernameCache = {};

async function fetchUserName(userId) {

    if (usernameCache[userId]) {
        return usernameCache[userId];
    }
    
    const response = await fetch(`${API_USERS_URL}/${userId}`, { method: 'GET' });
    const user = await response.json();
    usernameCache[userId] = user.username;
    
    return user.username;

}

function createMessageCard(message) {
    
    const sentDate = new Date(message.sent_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
        <div class="message-card">

            <div class="message-header">
                <strong>De:</strong> ${message.sender_username.toUpperCase() || 'Desconhecido'}
                <span class="message-date">(${sentDate})</span>
            </div>

            <div class="message-content">
                <p>${message.content}</p>
            </div>

            <div class="actions">
                <button 
                    onclick="window.location.href='send-message.html?receiverId=${message.sender_id}&receiverUsername=${message.sender_username}'">
                    Responder
                </button>
            </div>

        </div>
    `;

}

async function loadInbox() {

    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const currentUserId = user.id;
    const container = document.getElementById('inbox-list-container');
    const allMessagesResponse = await fetch(API_MESSAGES_URL, { method: 'GET' });
    const allMessages = await allMessagesResponse.json();
    const receivedMessages = allMessages.filter(message => message.receiver_id === currentUserId);
    
    if (!receivedMessages || receivedMessages.length === 0) {

        container.innerHTML = '<p>Sua caixa de entrada está vazia.</p>';

        return;

    }

    const markAsReadPromises = receivedMessages
        .filter(message => message.read === false) 
        .map(message => {
            const updatedMessage = {
                content: message.content,
                read: true
            };
            return fetch(`${API_MESSAGES_URL}/${message.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMessage) 
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`Falha na API ao marcar mensagem ${message.id}. Status: ${response.status}`);
                }
            })
            .catch(error => {
                console.error(`Falha de rede ao marcar mensagem ${message.id}:`, error);
            });
        });

    const messagesWithUsernames = await Promise.all(
        receivedMessages.map(async (message) => {
            
            const senderUsername = await fetchUserName(message.sender_id); 
            
            message.sender_username = senderUsername;

            return message;

        })
    );
    
    const inboxHtml = messagesWithUsernames.map(createMessageCard).join('');

    container.innerHTML = inboxHtml;

}

document.addEventListener('DOMContentLoaded', loadInbox);
