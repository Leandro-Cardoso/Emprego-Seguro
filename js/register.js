document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;

    try {

        const response = await fetch(API_USERS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    username,
                    email,
                    password,
                    phone,
                    location,
                    description
                }
            )
        });

        const user = await response.json();

        if (response.ok) {
            
            localStorage.setItem('user', JSON.stringify(user)); 
            
            window.location.href = 'index.html';

        } else {
            
            alert(`Erro no registro: ${user.message || 'Dados inválidos ou já registrados.'}`);

        }

    } catch (error) {

        console.error('Erro na requisição de registro:', error);
        alert('Ocorreu um erro na comunicação com o servidor.');

    }

});
