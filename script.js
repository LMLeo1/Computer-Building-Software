// 1. Sélection des éléments
const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const motherboardSelect = document.getElementById("mb-select");
const totalDisplay = document.getElementById("total-display");

const configNameInput = document.getElementById("config-name");
const configsUl = document.getElementById("configs-ul");

// 2. Fonction de calcul
const handleCalculation = function () {
    const selectedCpuPrice = Number(cpuSelect.value) || 0;
    const selectedGpuPrice = Number(gpuSelect.value) || 0;
    const selectedPsuPrice = Number(psuSelect.value) || 0;
    const selectedMbPrice = Number(motherboardSelect.value) || 0;

    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedMbPrice;
    totalDisplay.textContent = `${totalPrice.toFixed(2)}€`;
};

// 3. Logique de filtrage (Compatibilité)
cpuSelect.addEventListener("change", () => {
    // 1. On récupère le socket choisi
    const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
    const mbOptions = motherboardSelect.options;

    // 2. Reset de la sélection
    motherboardSelect.value = "";

    // 3. On parcourt les options pour les activer ou les désactiver
    for (let i = 0; i < mbOptions.length; i++) {
        const option = mbOptions[i];

        // On laisse toujours l'option vide ("Select a Motherboard...") activée
        if (option.value === "") {
            option.disabled = false;
        } else {
            // Si le socket correspond, on active (disabled = false)
            // Sinon, on désactive (disabled = true)
            option.disabled = (option.dataset.socket !== selectedSocket);
        }
    }
});

/// 1. Récupération des éléments
const saveBtn = document.getElementById("save-btn");

// 2. Action simple
saveBtn.addEventListener("click", () => {
    const name = configNameInput.value;
    if (!name) {
        alert("Entre un nom !");
        return;
    }

    // Création de l'élément de liste
    const li = document.createElement("li");
    li.textContent = name + " ";

    // Création du bouton
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = function() {
        li.remove();
    };

    // Assemblage
    li.appendChild(btn);
    configsUl.appendChild(li);

    // Nettoyage
    configNameInput.value = "";
});