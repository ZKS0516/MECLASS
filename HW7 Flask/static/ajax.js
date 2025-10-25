document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message);
        if (result.success) {
            window.location.href = `/dashboard/teacher?username=${data.username}`;
        }
    })
    .catch(error => {
        alert("Server error. Please try again later.");
        console.error("Login error:", error);
    });
});
