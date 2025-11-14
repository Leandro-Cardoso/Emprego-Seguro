function createMapIframe(location) {
    if (!location) {
        return '';
    }
    
    const encodedLocation = encodeURIComponent(location);
    const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return `
        <iframe
            width="100%"
            height="200"
            frameborder="0"
            style="border:0; margin-top: 15px; border-radius: 8px;"
            src="${mapUrl}"
            allowfullscreen
        ></iframe>
    `;
}

function createProfileServiceCard(service) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(service.price || 0);

    const mapImage = createMapIframe(service.location); 
    
    const descriptionText = service.description 
        ? service.description.substring(0, 150) + (service.description.length > 150 ? '...' : '')
        : 'Nenhuma descrição.';

    return `
        <div class="service-card">
            <div>
                <h4 style="font-size: 1.2em; color: #007bff; margin-bottom: 5px;">${service.title}</h4>
                <p style="font-size: 0.9em; color: #666;"><strong>Categoria:</strong> ${service.category}</p>
                <p style="font-size: 0.9em; color: #666; margin-bottom: 10px;"><strong>Localização:</strong> ${service.location}</p>
                
                ${service.price > 0 ? `<p class="service-price" style="font-weight: bold; color: #28a745; font-size: 1.5em;">${formattedPrice}</p>` : ''}
                
                <p class="service-description" style="color: #444; font-size: 0.9em; margin-top: 10px;">${descriptionText}</p>
            </div>

            ${mapImage}
        </div>
    `;
}

async function fetchVendedorServices(userId) {
    const servicesContainer = document.getElementById('services-list-container');
    const requestUrl = `${API_USERS_URL}/${userId}/services`; 

    servicesContainer.innerHTML = '<p style="text-align: center; color: #666;">Buscando serviços...</p>';
    
    let services = [];
    let errorStatus = null; 

    try {
        const response = await fetch(requestUrl, { method: 'GET' });
        
        if (!response.ok) {
            errorStatus = response.status;
            throw new Error(`Erro de rede: ${response.status}`);
        }

        services = await response.json();
        
    } catch (error) {
        console.error(`Falha ao buscar dados dos serviços. Status HTTP: ${errorStatus || 'NETWORK ERROR'}. Verifique se a rota '/users/<id>/services' no Flask está retornando JSON. Detalhes:`, error);
        
        servicesContainer.innerHTML = `<p style="text-align: center; color: red;">Erro ao carregar os serviços. Código: ${errorStatus || 'ERRO DE REDE'}.</p>`;
        return;
        
    } finally {
        if (services && services.length > 0) {
            const servicesHtml = services.map(service => createProfileServiceCard(service)).join('');
            servicesContainer.innerHTML = `<div class="services-grid">${servicesHtml}</div>`;
        } else if (services && services.length === 0) {
            servicesContainer.innerHTML = '<p style="text-align: center; color: #666;">Este vendedor ainda não cadastrou serviços.</p>';
        }
    }
}

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

        await fetchVendedorServices(userId);

    } catch (error) {
        console.error('Falha ao buscar dados do vendedor:', error);
        usernameDisplay.textContent = 'Perfil Indisponível';
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'Não foi possível carregar as informações do vendedor.';
        errorMessage.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadVendedorProfile();
});
