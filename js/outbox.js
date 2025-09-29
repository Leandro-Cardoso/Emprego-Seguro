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
                <strong>Para:</strong> ${message.receiver_username.toUpperCase() || 'Desconhecido'}
                <span class="message-date">(${sentDate})</span>
            </div>

            <div class="message-content">
                <p>${message.content}</p>
            </div>

            <div class="actions">
                <button 
                    onclick="window.location.href='send-message.html?receiverId=${message.receiver_id}&receiverUsername=${message.receiver_username}'">
                    Responder
                </button>
            </div>

        </div>
    `;

}

async function loadOutbox() {

    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const currentUserId = user.id;
    const container = document.getElementById('outbox-list-container');
    const allMessagesResponse = await fetch(API_MESSAGES_URL, { method: 'GET' });
    const allMessages = await allMessagesResponse.json();
    const sentMessages = allMessages.filter(message => message.sender_id === currentUserId);
    
    if (!sentMessages || sentMessages.length === 0) {

        container.innerHTML = '<p>Você não enviou nenhuma mensagem.</p>';

        return;

    }
    
    const messagesWithUsernames = await Promise.all(
        sentMessages.map(async (message) => {
            
            const receiverUsername = await fetchUserName(message.receiver_id); 
            
            message.receiver_username = receiverUsername;

            return message;

        })
    );
    
    const outboxHtml = messagesWithUsernames.map(createMessageCard).join('');

    container.innerHTML = outboxHtml;

}

document.addEventListener('DOMContentLoaded', loadOutbox);
