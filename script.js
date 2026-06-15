const calculateButton = document.getElementById("calc-btn");
const cpuSelect = document.getElementById("cpu-select");
const gpuSelect = document.getElementById("gpu-select");
const totalDisplay = document.getElementById("total-display");
calculateButton.addEventListener("click", function() { 
    const selectedCpuPrice = Number(cpuSelect.value);
    const selectedGpuPrice = Number(gpuSelect.value);
    const totalPrice = selectedCpuPrice + selectedGpuPrice;
    totalDisplay.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
});
 const gpuCatalog = [
{ name: "AMD RX 7600 XT", price: 330, powerRequired: 600 }, // Index 0
{ name: "NVIDIA RTX 4070 Super", price: 650, powerRequired: 650 }, // Index 1
{ name: "NVIDIA RTX 4080 Super", price: 1050, powerRequired: 750 } // Index 2
];
const firstGpu = gpuCatalog[0];
console.log("First GPU Name:", firstGpu.name);
console.log("First GPU Price:", "$" + firstGpu.price);
const catalogSize = gpuCatalog.length;
console.log("Total GPUs in catalog:", catalogSize);