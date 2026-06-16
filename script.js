const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const psuSelect = document.getElementById("psu-select");
const totalDisplay = document.getElementById("total-display");
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
    