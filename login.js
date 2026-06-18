const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // 1. On récupère la liste des utilisateurs depuis le stockage du navigateur
    const users = JSON.parse(localStorage.getItem('usersList')) || [];

    // 2. On cherche l'utilisateur
    const user = users.find(u => u.email === email && u.password === password);

    // 3. Vérification
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            email: user.email
        }));
        
        alert("Connexion réussie !");
        window.location.href = "index.html";
    } else {
        alert("Email ou mot de passe incorrect.");
    }
});