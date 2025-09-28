const LOGIN_URL = 'login.html'; 

function getUser() {

    const userString = localStorage.getItem('user'); 

    if (!userString) {

        window.location.href = LOGIN_URL; // Redirecionar

        return null;

    }

}

document.addEventListener('DOMContentLoaded', () => {
    
    user = getUser();

});
