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

const catalogModal = document.getElementById("catalog-modal");
const modalTitle = document.getElementById("modal-title");
const modalGrid = document.getElementById("modal-catalog-grid");
const closeModalBtn = document.getElementById("close-modal");

let catalogData = null;

// ==========================================
// 2. FONCTIONS LOGIQUES & CALCULS
// ==========================================
const handleCalculation = function () {
    const selectedCpuPrice = Number(cpuSelect.value) || 0;
    const selectedGpuPrice = Number(gpuSelect.value) || 0;
    const selectedPsuPrice = Number(psuSelect.value) || 0;
    const selectedRamPrice = Number(ramSelect.value) || 0;
    const selectedMbPrice = Number(motherboardSelect.value) || 0;

    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedRamPrice + selectedMbPrice;
    totalDisplay.textContent = `${totalPrice.toFixed(2)}€`;
};

function updateSlotPreview(selectId, itemName, itemPrice) {
    const previewBox = document.querySelector(`[data-select-id="${selectId}"] .slot-preview`);
    if (!previewBox) return;

    if (itemPrice === "0" || !itemPrice) {
        previewBox.innerHTML = `<span>Sélectionner un composant...</span>`;
    } else {
        const imgPath = `images/${itemName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;

        previewBox.innerHTML = `
            <img src="${imgPath}" onerror="this.src='https://placehold.co/100x100/1e293b/00e5ff?text=PC+Part'" alt="${itemName}">
            <div>
                <strong>${itemName}</strong><br>
                <small style="color: #00e5ff;">${itemPrice}€</small>
            </div>
        `;
    }
}

function loadConfig(components) {
    const selects = [cpuSelect, motherboardSelect, gpuSelect, psuSelect, ramSelect];
    const values = [components.cpu, components.motherboard, components.gpu, components.psu, components.ram];

    selects.forEach((select, i) => {
        if (select) {
            let found = false;
            for (let opt of select.options) {
                if (opt.text === values[i]) {
                    select.value = opt.value;
                    updateSlotPreview(select.id, opt.text.split(' (')[0], opt.value);
                    found = true;
                    break;
                }
            }
            if (!found) updateSlotPreview(select.id, "", "0");
        }
    });

    handleCalculation();
    alert("Configuration chargée !");
}

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
        configsUl.innerHTML = "<li>Tu n'as pas de configuration sauvegardée</li>";
        return;
    }

    myConfigs.forEach((config) => {
        const li = document.createElement("li");
        li.style.marginBottom = "15px"; li.style.padding = "10px";
        li.style.border = "1px solid #333"; li.style.borderRadius = "5px"; li.style.listStyle = "none";

        li.innerHTML = `
            <strong>${config.name}</strong> - <span style="color: #00e5ff;">${config.price}</span> <small>(${config.date})</small><br>
            <small style="color: #bbb;">${config.components.cpu} | ${config.components.motherboard} | ${config.components.gpu} | ${config.components.ram} | ${config.components.psu}</small><br>
        `;

        const loadBtn = document.createElement("button");
        loadBtn.textContent = "Load"; loadBtn.style.marginTop = "5px";
        loadBtn.onclick = () => loadConfig(config.components);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete config"; delBtn.style.marginLeft = "10px"; delBtn.style.marginTop = "5px";
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
// 3. ENTRÉE DANS LE CATALOGUE (JSON & MODAL)
// ==========================================
async function initialiserConfigurateur() {
    try {
        const response = await fetch('catalog.json');
        catalogData = await response.json();

        catalogData.cpus.forEach(item => populateSelect(cpuSelect, item, ['socket']));
        catalogData.motherboards.forEach(item => populateSelect(motherboardSelect, item, ['socket']));
        catalogData.gpus.forEach(item => populateSelect(gpuSelect, item, ['powerRequired']));
        catalogData.psus.forEach(item => populateSelect(psuSelect, item, ['powerOutput']));
        catalogData.rams.forEach(item => populateSelect(ramSelect, item));
    } catch (error) {
        console.error("Erreur lors du chargement du catalogue JSON :", error);
    }
}

function populateSelect(selectEl, item, dataKeys = []) {
    const option = document.createElement("option");
    option.value = item.price;
    option.textContent = `${item.name} (${item.price}€)`;
    dataKeys.forEach(k => option.dataset[k] = item[k]);
    selectEl.appendChild(option);
}

function openComponentCatalog(category, selectId) {
    if (!catalogData || !catalogData[category]) return;

    const titles = { cpus: "Processeurs (CPU)", gpus: "Cartes Graphiques (GPU)", motherboards: "Cartes Mères", psus: "Alimentations (PSU)", rams: "Mémoire Vive (RAM)" };
    modalTitle.textContent = `Choisir un composant : ${titles[category] || category}`;

    modalGrid.innerHTML = "";

    const items = catalogData[category];
    const selectEl = document.getElementById(selectId);
    const selectedCpuSocket = cpuSelect.options[cpuSelect.selectedIndex]?.dataset?.socket;

    items.forEach(item => {
        if (category === "motherboards" && selectedCpuSocket && item.socket !== selectedCpuSocket) {
            return;
        }

        const card = document.createElement("div");
        card.className = "component-card";

        // VÉRIFICATION IMAGE : Utilise la clé "image" du JSON si elle existe, sinon génère le nom automatique
        const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const itemImg = item.image || `images/${cleanName}.png`;

        card.innerHTML = `
            <div>
                <img src="${itemImg}" onerror="this.src='https://placehold.co/200x150/1e293b/00e5ff?text=${category.slice(0, -1).toUpperCase()}'" alt="${item.name}">
                <h4>${item.name}</h4>
                ${item.socket ? `<small style="display:block;margin-bottom:5px;color:#94a3b8">Socket: ${item.socket.toUpperCase()}</small>` : ''}
            </div>
            <div>
                <div class="price">${item.price}€</div>
                <button class="select-item-btn" style="width:100%; padding: 5px 0;">Choisir</button>
            </div>
        `;

        card.querySelector(".select-item-btn").addEventListener("click", () => {
            for (let option of selectEl.options) {
                if (option.text.startsWith(item.name)) {
                    selectEl.value = option.value;
                    break;
                }
            }

            selectEl.dispatchEvent(new Event('change'));
            updateSlotPreview(selectId, item.name, item.price);
            handleCalculation();

            catalogModal.close(); // Fermeture propre native
        });

        modalGrid.appendChild(card);
    });

    catalogModal.showModal(); // Ouverture native (Premier plan + bloque le scroll automatique !)
}

// ==========================================
// 4. ÉVÉNEMENTS GLOBAUX
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initialiserConfigurateur();
    displayUserConfigs();

    if (calculateButton) calculateButton.addEventListener("click", handleCalculation);

    document.querySelectorAll(".component-slot").forEach(slot => {
        slot.querySelector(".slot-preview").addEventListener("click", () => {
            const category = slot.dataset.category;
            const selectId = slot.dataset.selectId;
            openComponentCatalog(category, selectId);
        });
    });

    closeModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        catalogModal.close(); // Fermeture propre croix
    });

    cpuSelect.addEventListener("change", () => {
        const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
        const currentMbSocket = motherboardSelect.options[motherboardSelect.selectedIndex]?.dataset?.socket;

        if (currentMbSocket && currentMbSocket !== selectedSocket) {
            motherboardSelect.value = "0";
            updateSlotPreview("mb-select", "", "0");
            handleCalculation();
        }
    });

    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");
    const welcomeMessage = document.getElementById("welcome-message");
    const promoText = document.getElementById("promo-text");
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        if (welcomeMessage) welcomeMessage.textContent = `Connecté en tant que ${user.username}`;
        if (promoText) promoText.style.display = "none";
        if (loginLink) loginLink.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    if (saveConfigBtn) {
        saveConfigBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) { return alert("You need to be loged in to save !"); }

            const configName = configNameInput ? configNameInput.value.trim() : "";
            if (!configName) { return alert("Give a name to your configuration"); }

            if (cpuSelect.value === "0" || ramSelect.value === "0" || motherboardSelect.value === "0" || gpuSelect.value === "0" || psuSelect.value === "0") {
                return alert("Select all components to save !");
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

// REMPLACE TON CODE BURGER PAR CELUI-CI TOUT EN BAS DE SCRIPT.JS
document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById('burger-btn');
    const navTabs = document.getElementById('nav-tabs');

    if (burgerBtn && navTabs) {
        burgerBtn.addEventListener('click', () => {
            console.log("Clic détecté ! Le menu va basculer."); 
            navTabs.classList.toggle('open');
            
            if (navTabs.classList.contains('open')) {
                burgerBtn.innerHTML = '&times;'; 
            } else {
                burgerBtn.innerHTML = '&#9776;'; 
            }
        });
    } else {
        console.log("Attention : Le bouton burger ou le menu nav-tabs est introuvable dans l'HTML.");
    }
});