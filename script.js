// 1. Sélection des éléments
const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const ramSelect = document.getElementById("ram-select");
const motherboardSelect = document.getElementById("mb-select");
const totalDisplay = document.getElementById("total-display");

const saveBtn = document.getElementById("save-btn");
const configNameInput = document.getElementById("config-name");
const configsUl = document.getElementById("configs-ul");

// Fonction de calcul
const handleCalculation = function () {
    const selectedCpuPrice = Number(cpuSelect.value) || 0;
    const selectedGpuPrice = Number(gpuSelect.value) || 0;
    const selectedPsuPrice = Number(psuSelect.value) || 0;
    const selectedRamPrice = Number(ramSelect.value) || 0;
    const selectedMbPrice = Number(motherboardSelect.value) || 0;
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedRamPrice + selectedMbPrice;
    totalDisplay.textContent = `${totalPrice.toFixed(2)}€`;
};

calculateButton.addEventListener("click", handleCalculation);

// Filtrage socket
cpuSelect.addEventListener("change", () => {
    const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
    for (let option of motherboardSelect.options) {
        if (option.value === "") { option.disabled = false; }
        else { option.disabled = (option.dataset.socket !== selectedSocket); }
    }
});

// Sauvegarde
saveBtn.addEventListener("click", () => {
    const name = configNameInput.value;
    if (!name) return alert("Donne un nom !");

    handleCalculation();

    // On stocke les données pour pouvoir les recharger plus tard
    const configData = {
        name: name,
        price: totalDisplay.textContent,
        parts: {
            cpu: cpuSelect.options[cpuSelect.selectedIndex].text,
            mb: motherboardSelect.options[motherboardSelect.selectedIndex].text,
            gpu: gpuSelect.options[gpuSelect.selectedIndex].text,
            psu: psuSelect.options[psuSelect.selectedIndex].text,
            ram: ramSelect.options[ramSelect.selectedIndex].text
        }
    };

    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong> - ${configData.price}<br>
                    <small>${configData.parts.cpu} | ${configData.parts.mb} | ${configData.parts.gpu} | ${configData.parts.psu} | ${configData.parts.ram}</small><br>`;

    // Bouton Load
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.onclick = () => loadConfig(configData.parts);
    
    // Bouton Supprimer
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete config";
    delBtn.onclick = () => li.remove();

    li.appendChild(loadBtn);
    li.appendChild(delBtn);
    configsUl.appendChild(li);

    configNameInput.value = "";
});

// Fonction pour charger la config
function loadConfig(parts) {
    const selects = [cpuSelect, motherboardSelect, gpuSelect, psuSelect, ramSelect];
    const values = [parts.cpu, parts.mb, parts.gpu, parts.psu, parts.ram];

    selects.forEach((select, i) => {
        for (let opt of select.options) {
            if (opt.text === values[i]) {
                select.value = opt.value;
                break;
            }
        }
    });
    handleCalculation();
    alert("Configuration chargée !");
}

// La fonction est "async" car elle attend des données externes
async function initialiserConfigurateur() {
    const response = await fetch('catalog.json');
    const data = await response.json();

    const cpuSelect = document.getElementById("cpu-select");
    const ramSelect = document.getElementById("ram-select");
    // On boucle sur chaque CPU de ton JSON
    data.cpus.sort(cpu => {
        const option = document.createElement("option");
        option.value = cpu.price; // Le prix comme valeur
        option.textContent = `${cpu.name} (${cpu.price}€)`; // Le texte affiché
        option.dataset.socket = cpu.socket; // On garde l'info du socket
        cpuSelect.appendChild(option);
    });

    data.motherboards.forEach(mb => {
        const option = document.createElement("option");
        option.value = mb.price; // Le prix comme valeur
        option.textContent = `${mb.name} (${mb.price}€)`; // Le texte affiché
        option.dataset.socket = mb.socket; // On garde l'info du socket
        motherboardSelect.appendChild(option);
    });

    data.gpus.forEach(gpu => {
        const option = document.createElement("option");
        option.value = gpu.price; // Le prix comme valeur
        option.textContent = `${gpu.name} (${gpu.price}€)`; // Le texte affiché
        option.dataset.powerRequired = gpu.powerRequired; // On garde l'info de la puissance requise
        gpuSelect.appendChild(option);
    });

    data.psus.forEach(psu => {
        const option = document.createElement("option");
        option.value = psu.price; // Le prix comme valeur
        option.textContent = `${psu.name} (${psu.price}€)`; // Le texte affiché
        option.dataset.powerOutput = psu.powerOutput; // On garde l'info de la puissance fournie
        psuSelect.appendChild(option);
    });

    data.rams.forEach(ram => {
    const option = document.createElement("option");
    option.value = ram.price;
    option.textContent = `${ram.name} (${ram.price}€)`;
    ramSelect.appendChild(option);
});
}

// Appelle la fonction au chargement
initialiserConfigurateur();

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");
    const welcomeMessage = document.getElementById("welcome-message");
    
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        // --- CAS : UTILISATEUR CONNECTÉ ---
        welcomeMessage.textContent = `Connecté en tant que ${user.username}`;
        const promoText = document.getElementById("promo-text");
        if (promoText) promoText.style.display = "none";
        
        loginLink.style.display = "none";    // On cache le bouton "Se connecter"
        logoutBtn.style.display = "inline";  // On affiche le bouton "Déconnexion"
    } else {
        // --- CAS : UTILISATEUR DÉCONNECTÉ ---
        welcomeMessage.textContent = "";     // Rien à afficher
        const promoText = document.getElementById("promo-text");
        if (promoText) promoText.style.display = "block";
        
        loginLink.style.display = "inline";  // On montre "Se connecter"
        logoutBtn.style.display = "none";    // On cache le bouton "Déconnexion"
    }

    // Gestion de la déconnexion
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('currentUser');
        window.location.reload(); // Recharge la page pour tout réinitialiser
    });
});