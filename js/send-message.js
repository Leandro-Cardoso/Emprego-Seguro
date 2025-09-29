let globalReceiverId = null;

function loadReceiverData() {

    const urlParams = new URLSearchParams(window.location.search);
    const receiverId = urlParams.get('receiverId');
    const receiverUsername = urlParams.get('receiverUsername');
    
    if (receiverId && receiverUsername) {

        globalReceiverId = parseInt(receiverId);
        
        document.getElementById('receiver-name').textContent = receiverUsername;
        document.getElementById('receiver-id').value = globalReceiverId;

    } else {

        window.location.href = 'index.html';

    }

}

async function handleSendMessage(e) {

    e.preventDefault(); 
    
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const senderId = user.id;
    const content = document.getElementById('message-content').value;
    
    const messageData = {
        sender_id: senderId,
        receiver_id: globalReceiverId,
        content: content.trim()
    };

    const response = await fetch(API_MESSAGES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
    });
    
    setTimeout(() => {
        window.location.href = 'outbox.html'; 
    }, 1500);

}

document.addEventListener('DOMContentLoaded', () => {

    loadReceiverData();
    
    const form = document.getElementById('send-message-form');

    form.addEventListener('submit', handleSendMessage);

});
