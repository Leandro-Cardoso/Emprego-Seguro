function toggleMenu(id) {

    const menu = document.getElementById(id);

    menu.classList.toggle('hide');

}

function displayUsername() {
    
    const userString = localStorage.getItem('user');
    const nameElement = document.getElementById('username-display');
    const user = JSON.parse(userString);

    nameElement.textContent = user.username;

}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(displayUsername, 50); 
});
