localStorage.removeItem(LOCAL_STORAGE_KEY);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {

        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const user = await response.json();

        localStorage.setItem('user', JSON.stringify(user)); 
            
        window.location.href = 'index.html';

    } catch (error) {

        alert('Usuário ou senha incorretos.');

    }

});
