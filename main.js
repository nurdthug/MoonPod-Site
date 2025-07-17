import { ethers } from "ethers";

// DOM References
const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');
const podCounter = document.getElementById('pod-counter');
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');

let signer;
let userAddress = null;
const PLACEHOLDER_RECEIVE_ADDRESS = "0x9411dE226a239f05CeBfDf0b8A7A22e3101d4B09";

// Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    statusMsg.innerText = "Install MetaMask first!";
    statusMsg.className = "status-msg error";
    return;
  }
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    walletAddressSpan.innerText = userAddress.slice(0,6) + "..." + userAddress.slice(-4);
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

// Claim Logic
claimBtn.addEventListener('click', async () => {
  if (!signer || !userAddress) return;
  claimBtn.disabled = true;
  statusMsg.innerText = "Processing transaction...";
  statusMsg.className = "status-msg";
  try {
    const tx = await signer.sendTransaction({
      to: PLACEHOLDER_RECEIVE_ADDRESS,
      value: ethers.parseEther("0.1")
    });
    await tx.wait();
    statusMsg.innerText = "Success! Pod Claimed. Welcome aboard! 🚀";
    statusMsg.className = "status-msg success";
    incrementFakeCounter();
  } catch (err) {
    statusMsg.innerText = "Transaction cancelled or failed.";
    statusMsg.className = "status-msg error";
  }
  claimBtn.disabled = false;
});

// Pod Counter (Demo)
let fakePods = 23;
function updateCounter() {
  podCounter.innerText = `🌕 ${fakePods}/88 Pods Claimed`;
}
function incrementFakeCounter() {
  if (fakePods < 88) {
    fakePods += 1 + (Math.random() < 0.12 ? 1 : 0);
    if (fakePods > 88) fakePods = 88;
    updateCounter();
  }
}
updateCounter();

// Audio Toggle
let isAudioOn = false;
audioToggle.addEventListener('click', function () {
  isAudioOn = !isAudioOn;
  audioIcon.innerText = isAudioOn ? "🔈" : "🔊";
  if (isAudioOn) {
    audio.volume = 0.37;
    audio.play().catch(err => {
      console.warn("Audio playback blocked:", err);
      isAudioOn = false;
      audioIcon.innerText = "🔇";
    });
  } else {
    audio.pause();
  }
});
