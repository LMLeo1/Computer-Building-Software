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
