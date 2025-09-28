function createServiceCard(service) {
    
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(service.price);

    if (service.price <= 0) {

        return `
            <div class="service-card">

                <h3>${service.title}</h3>

                <p><strong>Categoria:</strong> ${service.category}</p>
                <p><strong>Localização:</strong> ${service.location}</p>
                <p class="service-description">${service.description}</p>
                
                <div class="actions">
                    <button onclick="editService(${service.id})">Editar</button>
                    <button onclick="deleteService(${service.id})">Excluir</button>
                </div>

            </div>
        `;
    }

    return `
        <div class="service-card">

            <h3>${service.title}</h3>

            <p><strong>Categoria:</strong> ${service.category}</p>
            <p><strong>Localização:</strong> ${service.location}</p>
            <p class="service-price"><strong>${formattedPrice}</strong></p>
            <p class="service-description">${service.description}</p>
            
            <div class="actions">
                <button onclick="editService(${service.id})">Editar</button>
                <button onclick="deleteService(${service.id})">Excluir</button>
            </div>

        </div>
    `;

}

async function loadUserServices() {
    
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const user = JSON.parse(userString);
    const userId = user.id;
    const container = document.getElementById('services-list-container');

    const response = await fetch(`${API_USERS_URL}/${userId}/services`, {
        method: 'GET'
    });

    const services = await response.json();

    if (services && services.length > 0) {
        
        const servicesHtml = services.map(createServiceCard).join('');
        container.innerHTML = servicesHtml;

    } else {

        container.innerHTML = '<p>Você ainda não tem serviços cadastrados.</p>';

    }

}

document.addEventListener('DOMContentLoaded', loadUserServices);

function createService() {

    window.location.href = './service-register.html';

}

function editService(serviceId) {

    alert('Função de Edição do Serviço ' + serviceId + ' (a implementar)');
    // Aqui você redirecionará para a página de edição de serviço.

    loadUserServices();

}

async function deleteService(serviceId) {

    const confirmDelete = confirm('Tem certeza que deseja EXCLUIR o serviço?');
    
    if (!confirmDelete) {
        return;
    }

    const response = await fetch(
        `${API_SERVICES_URL}/${serviceId}`,
        {method: 'DELETE'}
    );

    await loadUserServices();

}
