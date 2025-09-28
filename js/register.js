document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;

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

    localStorage.setItem('user', JSON.stringify(user)); 
    
    window.location.href = 'index.html';

});
