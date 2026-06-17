const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const motherboardSelect = document.getElementById("mb-select");
const totalDisplay = document.getElementById("total-display");

    const handleCalculation = function() {
    const selectedCpuPrice = Number(cpuSelect.value);
    const selectedGpuPrice = Number(gpuSelect.value);
    const selectedPsuPrice = Number(psuSelect.value);
    const selectedMotherboardPrice = Number(motherboardSelect.value);
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice + selectedMotherboardPrice;
    totalDisplay.textContent = `$${totalPrice.toFixed(2)}`; 
};
    calculateButton.addEventListener("click", handleCalculation); 


function filterMotherboards() {
    const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
    const mbOptions = motherboardSelect.options;

    for (let i = 0; i < mbOptions.length; i++) {
        const option = mbOptions[i];

        // L'option par défaut (value="") reste toujours visible
        if (option.value === "") {
            option.style.display = "block";
            continue;
        }

        // Si le socket correspond, on affiche, sinon on cache
        if (option.dataset.socket === selectedSocket) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    }
}

// 1. On lance le filtre quand on change le CPU
cpuSelect.addEventListener("change", () => {
    const selectedSocket = cpuSelect.options[cpuSelect.selectedIndex].dataset.socket;
    const mbOptions = motherboardSelect.options;

    // 1. On réinitialise la sélection à "Select a Motherboard..."
    motherboardSelect.value = ""; 

    // 2. On parcourt les options
    for (let i = 0; i < mbOptions.length; i++) {
        const option = mbOptions[i];

        if (option.value === "") {
            option.style.display = "block";
            continue;
        }

        if (option.dataset.socket === selectedSocket) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    }
});

// 2. On lance le filtre au démarrage (au cas où un CPU est pré-sélectionné)
filterMotherboards();

    // 4. On réinitialise la sélection de la carte mère pour éviter les erreurs
    motherboardSelect.value = ""