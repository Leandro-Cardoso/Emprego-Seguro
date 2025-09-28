let currentServiceId = null;
let currentUserId = null;

async function loadServiceData(serviceId) {

    currentServiceId = serviceId;
    
    const response = await fetch(`${API_SERVICES_URL}/${serviceId}`, {
        method: 'GET'
    });
    
    const service = await response.json();

    document.getElementById('title').value = service.title;
    document.getElementById('description').value = service.description;
    document.getElementById('category').value = service.category;
    document.getElementById('price').value = service.price;
    document.getElementById('location').value = service.location;
    
    currentUserId = service.user_id;

}

async function handleUpdate(e) {

    try {

        e.preventDefault();
        
        const updatedData = {
            
            user_id: currentUserId, 
            
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            location: document.getElementById('location').value,
            
            price: parseFloat(document.getElementById('price').value)

        };
        
        const response = await fetch(`${API_SERVICES_URL}/${currentServiceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        const updatedServiceObject = await response.json();

        alert(`Serviço "${updatedServiceObject.title}" atualizado com sucesso!`);
        
        window.location.href = SERVICES_PAGE_URL;

    } catch (error) {

        alert('Algum dado já foi utilizado em outro cadastro.');

    }

}

document.addEventListener('DOMContentLoaded', () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const idNumber = parseInt(serviceId);
        
    loadServiceData(idNumber);

    const form = document.getElementById('edit-service-form');

    form.addEventListener('submit', handleUpdate);
    
});
