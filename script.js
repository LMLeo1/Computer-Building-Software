const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const totalDisplay = document.getElementById("total-display");
calculateButton.addEventListener("click", function() {
    const selectedCpuPrice = Number(cpuSelect.value);
    const selectedGpuPrice = Number(gpuSelect.value);
    const totalPrice = selectedCpuPrice + selectedGpuPrice;
    totalDisplay.textContent = `Total Price: $${totalPrice.toFixed(2)}`; 
    totalDisplay.innerText = "$" + totalPrice; 
});