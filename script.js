function updateFiat() {
  const amount = document.getElementById("amount").value;
  const fiat = document.getElementById("fiat");

  // Agar amount number hai to dikhaye, warna $0.00
  if (!isNaN(amount) && amount.trim() !== "") {
    const formatted = parseFloat(amount).toFixed(2);
    fiat.textContent = `≈ $${formatted}`;
  } else {
    fiat.textContent = "≈ $0.00";
  }
}

function clearAddress() {
  document.getElementById("address").value = "";
}

function pasteAddress() {
  navigator.clipboard.readText().then(text => {
    document.getElementById("address").value = text;
  });
}

function fillMax() {
  // Demo ke liye max value ko 9999 set kar rahe hain
  document.getElementById("amount").value = "9999";
  updateFiat();
}

function sendUSDT() {
  alert("USDT transfer logic yahan implement hoga.");
  // Yahan Web3 ya Ethers.js logic lagega
}
