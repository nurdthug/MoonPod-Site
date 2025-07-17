import { ethers } from "ethers";

/* ...existing code... */
// ========== Wallet/Presale Logic ==========
const connectBtn = document.getElementById('connect-btn');
const claimBtn = document.getElementById('claim-btn');
const walletStatus = document.getElementById('wallet-status');
const walletAddressSpan = document.getElementById('wallet-address');
const statusMsg = document.getElementById('status-msg');

let signer;
let userAddress = null;

const PLACEHOLDER_RECEIVE_ADDRESS = "0x1111111111111111111111111111111111111111"; // For demo

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
      to: PLACEHOLDER_RECEIVE_ADDRESS,
      value: ethers.parseEther("0.1")
    });
    await tx.wait();
    statusMsg.innerText = "Success! Pod Claimed. Welcome aboard! 🚀";
    statusMsg.className = "status-msg success";
    // Optionally increase the counter as a demo
    incrementFakeCounter();
  } catch (err) {
    statusMsg.innerText = "Transaction cancelled or failed.";
    statusMsg.className = "status-msg error";
  }
  claimBtn.disabled = false;
});

// ========== Fake Pod Counter Logic ==========
const podCounter = document.getElementById('pod-counter');
// Start at 23, randomly increment on successful claim
let fakePods = 23;
function updateCounter() {
  podCounter.innerText = `🌕 ${fakePods}/88 Pods Claimed`;
}
function incrementFakeCounter() {
  if (fakePods < 88) {
    fakePods += 1 + (Math.random()<0.12?1:0);
    updateCounter();
    // Reduce chance of over-incrementing past 88
    if (fakePods > 88) fakePods = 88;
  }
}
updateCounter();

// ========== Audio Toggle ==========
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');
let isAudioOn = false;

audioToggle.addEventListener('click', function() {
  isAudioOn = !isAudioOn;
  audioIcon.innerText = isAudioOn ? "🔈" : "🔊";
  if (isAudioOn) {
    audio.volume = 0.37;
    audio.play();
  } else {
    audio.pause();
  }
});

// ========== Floating Moons/Stars/Astronaut Animation ==========
const canvas = document.getElementById('bg-anim');
let ctx, w, h;

function resizeCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

ctx = canvas.getContext('2d');
// Array of stars/moons/astronauts
const objects = [];
// Helper images (moon, astronaut SVGs as shapes)
function randBetween(a,b){ return Math.random()*(b-a)+a; }

// Star objects
for (let i=0;i<42;i++) {
  objects.push({
    kind: "star",
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    r: randBetween(0.6,2.3),
    s: randBetween(0.08,0.18),
    o: randBetween(0.33,0.98),
    t: Math.random()*10
  });
}
// Moons
for (let i=0;i<2;i++) {
  objects.push({
    kind: "moon",
    x: randBetween(0,w),
    y: randBetween(h*0.12, h*0.33),
    s: randBetween(33,57),
    t: Math.random()*30
  });
}
// Astronauts as circle "helmets"
for (let i=0;i<1;i++) {
  objects.push({
    kind: "astro",
    x: randBetween(w*0.2,w*0.8),
    y: randBetween(h*0.55,h*0.80),
    s: randBetween(30,48),
    sway: randBetween(-1,1.8),
    t: Math.random()*29
  });
}

function draw() {
  ctx.clearRect(0,0,w,h);

  // Stars twinkle
  objects.forEach(o => {
    if (o.kind==="star") {
      let flick = 0.44 + 0.46 * Math.sin(o.t + o.x/111 + o.y/37);
      ctx.globalAlpha = o.o * flick;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
      ctx.fillStyle = "#fff7ed";
      ctx.shadowColor = "#f9f9ef";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // Moons slowly float
  objects.forEach((o,idx) => {
    if (o.kind==="moon") {
      let phase = 0.16*Math.cos(perfNow*0.0004+idx)*o.s;
      let px = o.x + Math.sin(perfNow*0.00026 + idx)*13;
      let py = o.y + Math.cos(perfNow*0.00031 + idx)*9;
      // Main moon
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(px, py, o.s, 0, Math.PI*2);
      ctx.fillStyle = (idx%2)?'#e5f2ff':'#fdfff6';
      ctx.shadowColor = "#fcfbf0";
      ctx.shadowBlur = 24;
      ctx.fill();
      // Moon shadow (crescent)
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(px+phase*0.1, py+phase*0.13, o.s*0.9, 0, Math.PI*2);
      ctx.fillStyle = "#a0b3ea";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  });

  // Astronaut (helmet + suit blob, floats)
  objects.forEach((o,idx) => {
    if (o.kind==="astro") {
      let bobY = Math.sin(perfNow*0.001+o.t+o.sway)*8;
      let px = o.x + Math.cos(perfNow*0.001 + o.sway * 0.4)*22;
      let py = o.y + bobY;
      // Suit (body)
      ctx.globalAlpha = 0.31;
      ctx.beginPath();
      ctx.ellipse(px, py+o.s*0.63, o.s*0.7, o.s*0.68, 0, 0, Math.PI*2);
      ctx.fillStyle="#e1eef6";
      ctx.shadowColor="#93a5ff";
      ctx.shadowBlur=22;
      ctx.fill();
      ctx.shadowBlur=0;

      // Helmet
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(px, py, o.s*0.45, 0, Math.PI*2);
      ctx.fillStyle="#dbf3ff";
      ctx.shadowColor="#fff";
      ctx.shadowBlur=9;
      ctx.fill();
      ctx.shadowBlur=0;
      // Tint on helmet
      ctx.globalAlpha=0.31;
      ctx.beginPath();
      ctx.arc(px-o.s*0.13, py-o.s*0.13, o.s*0.17, 0, Math.PI*2);
      ctx.fillStyle="#bdf6ff";
      ctx.fill();
      ctx.globalAlpha=1;
      // Visor edge
      ctx.beginPath();
      ctx.arc(px, py, o.s*0.47, 0, Math.PI*2);
      ctx.strokeStyle="#7fadea";
      ctx.lineWidth=3.2;
      ctx.stroke();
      ctx.lineWidth=1;
      // Backpack
      ctx.beginPath();
      ctx.ellipse(px+o.s*0.34, py+o.s*0.22, o.s*0.13, o.s*0.26, 0, 0, Math.PI*2);
      ctx.fillStyle="#dde3fc";
      ctx.globalAlpha=0.9;
      ctx.fill();
      ctx.globalAlpha=1;
    }
  });
}

let perfNow = 0;
function animationLoop(ts) {
  perfNow = ts;
  draw();
  // Animate stars/moons/astro
  objects.forEach(o => { o.t += 0.02+Math.random()*0.01; });
  requestAnimationFrame(animationLoop);
}
animationLoop(performance.now());
/* ...existing code... */

