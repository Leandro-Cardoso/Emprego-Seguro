async function handleServiceSubmit(e) {

    try {
        
        e.preventDefault(); 
        
        const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
        const user = JSON.parse(userString);
        
        const serviceData = {
            
            user_id: user.id, 
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            location: document.getElementById('location').value,
            price: parseFloat(document.getElementById('price').value)

        };
        
        const response = await fetch(API_SERVICES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });

        const newServiceObject = await response.json();

        alert(`Serviço "${newServiceObject.title}" cadastrado com sucesso!`);
        
        window.location.href = SERVICES_PAGE_URL;

    } catch (error) {

        alert('Algum dado já foi utilizado em outro cadastro.');

    }
    
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('service-register-form');
    
    form.addEventListener('submit', handleServiceSubmit);

});
