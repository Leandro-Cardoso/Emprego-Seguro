async function fetchUserName(userId) {
    
    const response = await fetch(`${API_USERS_URL}/${userId}`, { method: 'GET' });
    const user = await response.json();
    
    return user.username;

}

function createServiceCard(service) {

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(service.price || 0);

    mapImage = createMapIframe(service.location);
    
    if (service.price <= 0) {

        return `
            <div class="service-card">

                <h3>${service.title}</h3>

                <p><strong>Usuário:</strong> ${service.username || 'Carregando...'}</p>

                <p><strong>Categoria:</strong> ${service.category}</p>
                <p><strong>Localização:</strong> ${service.location}</p>
                <p class="service-description">${service.description}</p>

                ${mapImage}

                <button onclick="sendMessage(${service.user_id}, '${service.username}')">
                    Enviar Mensagem
                </button>

            </div>
        `;
    }

    return `
        <div class="service-card">

            <h3>${service.title}</h3>

            <p><strong>Usuário:</strong> ${service.username || 'Carregando...'}</p>

            <p><strong>Categoria:</strong> ${service.category}</p>
            <p><strong>Localização:</strong> ${service.location}</p>
            <p class="service-price"><strong>${formattedPrice}</strong></p>
            <p class="service-description">${service.description}</p>

            ${mapImage}

            <button onclick="sendMessage(${service.user_id}, '${service.username}')">
                Enviar Mensagem
            </button>

        </div>
    `;

}

async function handleSearch(e) {

    e.preventDefault(); 

    const searchInput = document.getElementById('search'); 
    const query = searchInput.value;
    const container = document.getElementById('search-results');

    if (query.trim().length < 3) {

        container.innerHTML = '<h2>Aviso</h2><p>A busca deve ter no mínimo 3 caracteres.</p>';

        return;

    }

    const formattedQuery = encodeURIComponent(query.trim().replace(/\s+/g, '+'));
    const requestUrl = `${API_SERVICES_URL}/search?q=${formattedQuery}`;
    
    container.innerHTML = '<h2>Buscando serviços...</h2>';

    const response = await fetch(requestUrl, { method: 'GET' });
    const services = await response.json();

    if (services && services.length > 0) {

        const servicesWithUsers = await Promise.all(
            services.map(async (service) => {
                
                const userId = service.user_id; 
                const username = await fetchUserName(userId); 
                service.username = username;
                
                return service;

            })
        );

        const resultsHtml = servicesWithUsers.map(createServiceCard).join('');
        container.innerHTML = `<h2>Resultados Encontrados (${services.length})</h2><div class="services-grid">${resultsHtml}</div>`;

    } else {

        container.innerHTML = '<h2>Nenhum Resultado...</h2>';

    }

}

async function sendMessage(receiverId, receiverUsername) {
    
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const senderId = user.id;

    if (senderId === receiverId) {
        alert("Você não pode enviar uma mensagem para si mesmo.");
        return;
    }

    window.location.href = `send-message.html?receiverId=${receiverId}&receiverUsername=${receiverUsername}`;

}

document.addEventListener('DOMContentLoaded', () => {

    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

});
