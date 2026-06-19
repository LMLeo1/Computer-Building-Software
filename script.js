// ==========================================
// 1. SÉLECTION DES ÉLÉMENTS HTML
// ==========================================
const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const ramSelect = document.getElementById("ram-select");
const motherboardSelect = document.getElementById("mb-select"); 
const totalDisplay = document.getElementById("total-display");

const saveConfigBtn = document.getElementById("save-config-btn"); 
const configNameInput = document.getElementById("config-name"); 
const configsUl = document.getElementById("configs-list"); 

// ==========================================
// 2. FONCTIONS LOGIQUES
// ==========================================

// Fonction de calcul du total
const handleCalculation = function () {
    const selectedCpuPrice = Number(cpuSelect.value) || 0;
    const selectedGpuPrice = Number(gpuSelect.value) || 0;
    const selectedPsuPrice = Number(psuSelect.value) || 0;
    const selectedRamPrice = Number(ramSelect.value) || 0;
    const selectedMbPrice = Number(motherboardSelect.value) || 0;
    
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedRamPrice + selectedMbPrice;
    totalDisplay.textContent = `${totalPrice.toFixed(2)}€`;
};

// Fonction pour charger une configuration sélectionnée dans les menus
function loadConfig(components) {
    const selects = [cpuSelect, motherboardSelect, gpuSelect, psuSelect, ramSelect];
    const values = [components.cpu, components.motherboard, components.gpu, components.psu, components.ram];

    selects.forEach((select, i) => {
        if (select) {
            for (let opt of select.options) {
                if (opt.text === values[i]) {
                    select.value = opt.value;
                    break;
                }
            }
        }
    });
    
    handleCalculation(); 
    alert("Configuration chargée !");
}

// Fonction pour afficher les configurations sauvegardées
function displayUserConfigs() {
    if (!configsUl) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        configsUl.innerHTML = "<li>Connecte-toi pour voir tes configurations sauvegardées.</li>";
        return;
    }

    const allConfigs = JSON.parse(localStorage.getItem('allConfigs')) || [];
    const myConfigs = allConfigs.filter(config => config.ownerEmail === user.email);

    configsUl.innerHTML = "";

    if (myConfigs.length === 0) {
        configsUl.innerHTML = "<li>Tu n'as pas de configuration sauvegardés</li>";
        return;
    }

    myConfigs.forEach((config) => {
        const li = document.createElement("li");
        li.style.marginBottom = "15px";
        li.style.padding = "10px";
        li.style.border = "1px solid #333";
        li.style.borderRadius = "5px";
        li.style.listStyle = "none";
        
        li.innerHTML = `
            <strong>${config.name}</strong> - <span style="color: #00e5ff;">${config.price}</span> <small>(${config.date})</small><br>
            <small style="color: #bbb;">${config.components.cpu} | ${config.components.motherboard} | ${config.components.gpu} | ${config.components.ram} | ${config.components.psu}</small><br>
        `;
        
        // Bouton Load
        const loadBtn = document.createElement("button");
        loadBtn.textContent = "Load";
        loadBtn.style.marginTop = "5px";
        loadBtn.onclick = () => loadConfig(config.components);

        // Bouton Supprimer
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete config";
        delBtn.style.marginLeft = "10px";
        delBtn.style.marginTop = "5px";
        delBtn.onclick = () => {
            const updatedConfigs = allConfigs.filter(c => !(c.ownerEmail === user.email && c.name === config.name));
            localStorage.setItem('allConfigs', JSON.stringify(updatedConfigs));
            displayUserConfigs(); 
        };

        li.appendChild(loadBtn);
        li.appendChild(delBtn);
        configsUl.appendChild(li);
    });
}

// ==========================================
// 3. CHARGEMENT DU CATALOGUE (JSON)
// ==========================================
async function initialiserConfigurateur() {
    try {
        const response = await fetch('catalog.json');
        const data = await response.json();

        data.cpus.forEach(cpu => {
            const option = document.createElement("option");
            option.value = cpu.price;
            option.textContent = `${cpu.name} (${cpu.price}€)`;
            option.dataset.socket = cpu.socket;
            cpuSelect.appendChild(option);
        });

        data.motherboards.forEach(mb => {
            const option = document.createElement("option");
            option.value = mb.price;
            option.textContent = `${mb.name} (${mb.price}€)`;
            option.dataset.socket = mb.socket;
            motherboardSelect.appendChild(option);
        });

        data.gpus.forEach(gpu => {
            const option = document.createElement("option");
            option.value = gpu.price;
            option.textContent = `${gpu.name} (${gpu.price}€)`;
            option.dataset.powerRequired = gpu.powerRequired;
            gpuSelect.appendChild(option);
        });

        data.psus.forEach(psu => {
            const option = document.createElement("option");
            option.value = psu.price;
            option.textContent = `${psu.name} (${psu.price}€)`;
            option.dataset.powerOutput = psu.powerOutput;
            psuSelect.appendChild(option);
        });

        data.rams.forEach(ram => {
            const option = document.createElement("option");
            option.value = ram.price;
            option.textContent = `${ram.name} (${ram.price}€)`;
            ramSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement du catalogue JSON :", error);
    }
}

// ==========================================
// 4. ÉVÉNEMENTS AU CHARGEMENT DE LA PAGE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initialiserConfigurateur();
    displayUserConfigs();

    if (calculateButton) {
        calculateButton.addEventListener("click", handleCalculation);
    }

    // Filtrage socket
    cpuSelect.addEventListener("change", () => {
        const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
        for (let option of motherboardSelect.options) {
            if (option.value === "") { option.disabled = false; }
            else { option.disabled = (option.dataset.socket !== selectedSocket); }
        }
    });

    // Gestion de la bannière de connexion
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");
    const welcomeMessage = document.getElementById("welcome-message");
    const promoText = document.getElementById("promo-text");
    
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        if (welcomeMessage) welcomeMessage.textContent = `Connecté en tant que ${user.username}`;
        if (promoText) promoText.style.display = "none";
        if (loginLink) loginLink.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline";
    } else {
        if (welcomeMessage) welcomeMessage.textContent = "";
        if (promoText) promoText.style.display = "block";
        if (loginLink) loginLink.style.display = "inline";
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    // Gestion de la Sauvegarde
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener("click", (e) => {e
          e.preventDefault(); // <-- AJOUTE CETTE LIGNE ICI (elle bloque le refresh)  
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert("You need to be loged in to save !");
                return;
            }

            const configName = configNameInput ? configNameInput.value.trim() : "";
            if (!configName) {
                alert("Give a name to your configuration");
                return;
            }

            const cpu = cpuSelect.value;
            const ram = ramSelect.value;
            const mobo = motherboardSelect.value;
            const gpu = gpuSelect.value;
            const psu = psuSelect.value;

            if (!cpu || !ram || !mobo || !gpu || !psu) {
                alert("Select all component to save !");
                return;
            }

            handleCalculation(); 

            const newConfig = {
                ownerEmail: currentUser.email,
                name: configName,
                price: totalDisplay.textContent,
                date: new Date().toLocaleDateString(),
                components: {
                    cpu: cpuSelect.options[cpuSelect.selectedIndex].text,
                    motherboard: motherboardSelect.options[motherboardSelect.selectedIndex].text,
                    gpu: gpuSelect.options[gpuSelect.selectedIndex].text,
                    ram: ramSelect.options[ramSelect.selectedIndex].text,
                    psu: psuSelect.options[psuSelect.selectedIndex].text
                }
            };

            let allConfigs = JSON.parse(localStorage.getItem('allConfigs')) || [];
            allConfigs.push(newConfig);
            localStorage.setItem('allConfigs', JSON.stringify(allConfigs));

            alert(`La configuration "${configName}" a bien été enregistrée !`);
            
            if (configNameInput) configNameInput.value = ""; 
            displayUserConfigs(); 
        });
    }
});
