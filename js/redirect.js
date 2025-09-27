const LOGIN_PAGE_URL = 'login.html'; 

function getUser() {

    const userString = localStorage.getItem('user'); 

    if (!userString) {

        console.log("Usuário não logado. Redirecionando...");

        window.location.href = LOGIN_PAGE_URL; // Redirecionar

        return null;

    }
    
    try {

        return JSON.parse(userString);

    } catch (e) {

        localStorage.removeItem('user'); // Deslogar

        window.location.href = LOGIN_PAGE_URL; // Redirecionar

        return null;

    }

}

document.addEventListener('DOMContentLoaded', () => {
    
    user = getUser();

});
