function getUser() {

    const userString = localStorage.getItem(LOCAL_STORAGE_KEY); 

    if (!userString) {

        window.location.href = LOGIN_PAGE_URL; // Redirecionar

        return null;

    }

}

document.addEventListener('DOMContentLoaded', () => {
    
    user = getUser();

});
