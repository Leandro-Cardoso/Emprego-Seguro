let currentUser = null;

function loadUserProfile() {

    const userString = localStorage.getItem(LOCAL_STORAGE_KEY);
    currentUser = JSON.parse(userString);
    
    document.getElementById('username').value = currentUser.username;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('password').value = '';
    document.getElementById('phone').value = currentUser.phone;
    document.getElementById('location').value = currentUser.location;
    document.getElementById('description').value = currentUser.description;

}

async function handleUpdate(e) {
    
    e.preventDefault();
    
    const updatedData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };
    
    if (!updatedData.password) {
        delete updatedData.password;
    }

    const response = await fetch(`${API_USERS_URL}/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    const updatedUserObject = await response.json();
    const newUserState = { ...currentUser, ...updatedUserObject };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUserState));

    currentUser = newUserState; 

    alert('Perfil atualizado com sucesso!');

    loadUserProfile();

}

document.addEventListener('DOMContentLoaded', () => {
    
    loadUserProfile();

    const form = document.getElementById('edit-profile-form');

    form.addEventListener('submit', handleUpdate);

});
