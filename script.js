const cpuName = "AMD Ryzen 9 7950X";
// String
let cpuPrice = 420;
// Number
let isInStock = true;
// Boolean
console.log("---- CPU INFO ----");
console.log("Name:", cpuName);
console.log("Price ($):", cpuPrice);
console.log("Available:", isInStock);
function calculateTotalPrice(cpuPrice, gpuPrice, ramPrice, ssdPrice) {
    // Inside the machine: sum all parameters together
    const currentTotal = cpuPrice + gpuPrice + ramPrice + ssdPrice;
    // Shipping the final product back out
    return currentTotal;
}
const buildOneTotal = calculateTotalPrice(350, 850, 120, 90);
console.log("Client Build 1 Total:", "$" + buildOneTotal);
const buildTwoTotal = calculateTotalPrice(120, 200, 60, 45);
console.log("Budget Build 2 Total:", "$" + buildTwoTotal);