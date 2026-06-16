const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const totalDisplay = document.getElementById("total-display");
const gpuCatalog = [
    { name: "AMD RX 7600 XT", price: 330, powerRequired: 600 },       // Index 0
    { name: "NVIDIA RTX 4070 Super", price: 650, powerRequired: 650 }, // Index 1
    { name: "NVIDIA RTX 4080 Super", price: 1050, powerRequired: 750 }, // Index 2
    { name: "NVIDIA RTX 3060", price: 500, powerRequired: 550 } // Index 3
];

    const handleCalculation = function() {
    const selectedCpuPrice = Number(cpuSelect.value);
    const selectedGpuPrice = Number(gpuSelect.value);
    const selectedPsuPrice = Number(psuSelect.value);
    
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice;
    totalDisplay.textContent = `Total Price: $${totalPrice.toFixed(2)}`; 
};
    calculateButton.addEventListener("click", handleCalculation); 
    