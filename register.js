document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Récupère les valeurs
    const newUser = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    // Récupère la liste ou crée un tableau vide si elle n'existe pas encore
    let users = JSON.parse(localStorage.getItem('usersList')) || [];

    // Ajoute le nouvel utilisateur
    users.push(newUser);

    // SAUVEGARDE LA LISTE DANS LE LOCALSTORAGE
    localStorage.setItem('usersList', JSON.stringify(users));

    alert("Compte créé avec succès !");
});