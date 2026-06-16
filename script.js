const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const totalDisplay = document.getElementById("total-display");
const gpuCatalog = [
    { name: "NVIDIA RTX 5090", price: 1999, powerRequired: 900 },       // Index 0
    { name: "NVIDIA RTX 5080", price: 999, powerRequired: 850 }, // Index 1
    { name: "NVIDIA RTX 5070", price: 549, powerRequired: 600 }, // Index 2
    { name: "NVIDIA RTX 5070 Ti", price: 549, powerRequired: 750 }, // Index 3
    {name: "NVIDIA RTX 5060", price: 300, powerRequired: 500}, // Index 4
    { name: "NVIDIA RTX 4080 Super", price: 1050, powerRequired: 750 },
    {name: "NVIDIA RTX 4070 Super", price: 549, powerRequired: 600}, // Index 5
];
const cpuCatalog = [
    { name: "Intel Core i7-13700K", price: 350, powerRequired: 125 },
    { name: "AMD Ryzen 9 7950X", price: 450, powerRequired: 120 }
    
];

    const handleCalculation = function() {
    const selectedCpuPrice = Number(cpuSelect.value);
    const selectedGpuPrice = Number(gpuSelect.value);
    const selectedPsuPrice = Number(psuSelect.value);
    
    const totalPrice = selectedCpuPrice + selectedGpuPrice + selectedPsuPrice;
    totalDisplay.textContent = `$${totalPrice.toFixed(2)}`; 
};
    calculateButton.addEventListener("click", handleCalculation); 
    