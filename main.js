const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');
const podCounter = document.getElementById('pod-counter');

const receiver = "0x9411dE226a239f05CeBfDf0b8A7A22e3101d4B09"; // Your wallet
let signer, userAddress;
let claimedPods = parseInt(localStorage.getItem("claimedPods")) || 0;

function updateCounter() {
  podCounter.innerText = `🌕 ${claimedPods}/88 Pods Claimed`;
}
updateCounter();

connectBtn.addEventListener('click', async () => {
  if (!window.ethereum) {
    statusMsg.innerText = "Install MetaMask!";
    return;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    walletStatus.style.display = "block";
    walletAddressSpan.innerText = userAddress.slice(0,6) + "..." + userAddress.slice(-4);
    connectBtn.style.display = "none";
    claimBtn.disabled = false;
    statusMsg.innerText = "";
  } catch (err) {
    statusMsg.innerText = "Wallet connection rejected.";
  }
});

claimBtn.addEventListener('click', async () => {
  if (!signer || !userAddress) return;
  claimBtn.disabled = true;
  statusMsg.innerText = "Sending 0.1 ETH...";
  try {
    const tx = await signer.sendTransaction({
      to: receiver,
      value: ethers.parseEther("0.1")
    });
    await tx.wait();
    statusMsg.innerText = "✅ Pod Claimed! 🚀";
    claimedPods = Math.min(claimedPods + 1, 88);
    localStorage.setItem("claimedPods", claimedPods);
    updateCounter();
  } catch (err) {
    statusMsg.innerText = "❌ Transaction failed or rejected.";
  }
  claimBtn.disabled = false;
});

// Audio toggle
const audio = document.getElementById("space-audio");
const audioToggle = document.getElementById("audio-toggle");
const audioIcon = document.getElementById("audio-icon");
let isAudioOn = false;

audioToggle.addEventListener('click', () => {
  isAudioOn = !isAudioOn;
  audioIcon.innerText = isAudioOn ? "🔈" : "🔊";
  if (isAudioOn) {
    audio.volume = 0.4;
    audio.play();
  } else {
    audio.pause();
  }
});
