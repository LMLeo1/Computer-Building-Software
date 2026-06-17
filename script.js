// 1. Sélection des éléments
const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
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
    const selectedMbPrice = Number(motherboardSelect.value) || 0;
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedMbPrice;
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
            psu: psuSelect.options[psuSelect.selectedIndex].text
        }
    };

    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong> - ${configData.price}<br>
                    <small>${configData.parts.cpu} | ${configData.parts.mb} | ${configData.parts.gpu} | ${configData.parts.psu}</small><br>`;

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
    const selects = [cpuSelect, motherboardSelect, gpuSelect, psuSelect];
    const values = [parts.cpu, parts.mb, parts.gpu, parts.psu];

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