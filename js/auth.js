document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const API_LOGIN_URL = 'http://localhost:5001/login';

    try {

        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const user = await response.json();

        if (response.ok) {
            
            localStorage.setItem('user', JSON.stringify(user)); 
            
            window.location.href = 'index.html';

        } else {
            
            alert(`Erro no login: ${user.message || 'Nome de usuário ou senha inválidos.'}`);

        }

    } catch (error) {

        console.error('Erro na requisição de login:', error);
        alert('Ocorreu um erro na comunicação com o servidor.');

    }

});
