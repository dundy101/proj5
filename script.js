// Basic game state
const state = {
  health: 100,
  hunger: 100,
  thirst: 100,
  gameOver: false,
  // Example decisions
  decisions: [
    {
      text: "Walk to the river to fetch water",
      effects: { health: -5, hunger: -10, thirst: +30 }
    },
    {
      text: "Eat some food",
      effects: { health: 0, hunger: +25, thirst: -5 }
    },
    {
      text: "Rest under a tree",
      effects: { health: +10, hunger: -5, thirst: -5 }
    }
  ]
};

// --- ADVANCED: UI State Management ---
let gamePhase = "intro"; // intro, playing, gameover

// --- DOM Elements ---
const introOverlay = document.getElementById('intro-overlay');
const startBtn = document.getElementById('start-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const barsDiv = document.getElementById('bars');
const choicesDiv = document.getElementById('choices');

// --- Advanced: Professional, Family-Friendly Intro Overlay ---
if (introOverlay) {
  introOverlay.innerHTML = `
    <div class="intro-content">
      <div style="width:100%; display:flex; align-items:center; justify-content:center; margin:0 auto 1em auto; background:#F9E4B7; border-radius:18px; box-shadow:0 2px 12px rgba(30,60,120,0.10); overflow:auto;">
        <img src="waterlogo2.png" alt="Water Charity Logo" style="display:block; width:auto; height:auto; max-width:100%; max-height:300px;">
      </div>
      <h1 style="font-size:2.7em; color:#1A237E; margin-bottom:0.3em;">Welcome to Water Warrior!</h1>
      <p style="font-size:1.25em; color:#8D6748; margin-bottom:1.2em;">
        Join us on a heartwarming journey to help your village thrive by making smart choices about water, food, and health.<br>
        <span style="color:#1A237E; font-weight:bold;">Every drop counts!</span>
      </p>
      <div style="font-size:1.1em; color:#4DD0E1; margin-bottom:1.5em;">
        <strong>
        Learn, play, and discover how your actions can make a difference for communities around the world.
      </div>
      <button id="start-btn" style="background:linear-gradient(90deg,#FFD600 0%,#4DD0E1 100%);color:#1A237E;">Start Your Adventure</button>
      <button id="settings-btn" style="background:linear-gradient(90deg,#FFD600 0%,#4DD0E1 100%);color:#1A237E;">Settings</button>
      <div id="settings-panel" style="display:none;">
        <h2 style="margin-top:0;color:#1A237E;">Settings</h2>
        <p>Adjust your experience (coming soon!)</p>
        <button id="close-settings-btn" style="background:#4DD0E1;color:#1A237E;border:1px solid #64B5F6;">Close</button>
      </div>
      <div style="margin-top:2em; font-size:0.95em; color:#8D6748;">
        <em>Created for families, classrooms, and everyone who cares about water.</em>
      </div>
    </div>
  `;
}

// --- Basic Game Logic ---
function updateBars() {
  document.getElementById('health-bar').textContent = state.health;
  document.getElementById('hunger-bar').textContent = state.hunger;
  document.getElementById('thirst-bar').textContent = state.thirst;
}

function checkGameOver() {
  if (state.health <= 0 || state.hunger <= 0 || state.thirst <= 0) {
    state.gameOver = true;
    document.getElementById('game-message').textContent = "Game Over!";
    document.getElementById('choices').innerHTML = "";
  }
}

// --- Intro/Settings Logic ---
if (startBtn) {
  startBtn.onclick = () => {
    introOverlay.style.display = "none";
    barsDiv.style.display = "";
    choicesDiv.style.display = "";
    gamePhase = "playing";
    startVillageScene();
  };
}
if (settingsBtn) {
  settingsBtn.onclick = () => {
    settingsPanel.style.display = "block";
  };
}
if (closeSettingsBtn) {
  closeSettingsBtn.onclick = () => {
    settingsPanel.style.display = "none";
  };
}

// --- Village Scene and Choices ---
function startVillageScene() {
  // Set up the initial 3 options for the village
  state.decisions = [
    {
      text: "Talk to the village elder",
      effects: { health: 0, hunger: 0, thirst: 0 },
      onChoose: () => showVillageMessage("The elder gives you advice about finding water sources.")
    },
    {
      text: "Visit the well",
      effects: { health: 0, hunger: -5, thirst: +20 },
      onChoose: () => showVillageMessage("You drink from the well and feel refreshed.")
    },
    {
      text: "Explore the outskirts",
      effects: { health: -5, hunger: -10, thirst: -10 },
      onChoose: () => showVillageMessage("You explore the outskirts and discover a hidden path.")
    }
  ];
  updateBars();
  renderChoices();
  document.getElementById('game-message').textContent = "You are in your village. What will you do?";
  // Place character in village
  character.x = 200;
  character.direction = 1;
  character.walking = false;
  drawGame();
}

// Show a message and then allow player to continue (advanced: could chain scenes)
function showVillageMessage(msg) {
  document.getElementById('game-message').textContent = msg + " (Click any option to continue.)";
  // After first choice, enable walking and restore main game loop/choices
  state.decisions = [
    {
      text: "Walk to the river to fetch water",
      effects: { health: -5, hunger: -10, thirst: +30 }
    },
    {
      text: "Eat some food",
      effects: { health: 0, hunger: +25, thirst: -5 }
    },
    {
      text: "Rest under a tree",
      effects: { health: +10, hunger: -5, thirst: -5 }
    }
  ];
  character.walking = true;
  renderChoices();
}

// --- Override makeChoice for advanced logic ---
function makeChoice(index) {
  if (state.gameOver) return;
  const decision = state.decisions[index];
  const effects = decision.effects;
  state.health += effects.health;
  state.hunger += effects.hunger;
  state.thirst += effects.thirst;
  // Clamp values between 0 and 100
  state.health = Math.max(0, Math.min(100, state.health));
  state.hunger = Math.max(0, Math.min(100, state.hunger));
  state.thirst = Math.max(0, Math.min(100, state.thirst));
  updateBars();
  checkGameOver();
  // Advanced: handle onChoose callback for scene transitions
  if (typeof decision.onChoose === "function") {
    decision.onChoose();
  }
}

// --- Render Choices (advanced: disables if not playing) ---
function renderChoices() {
  choicesDiv.innerHTML = "";
  if (gamePhase !== "playing") return;
  state.decisions.forEach((decision, idx) => {
    const btn = document.createElement('button');
    btn.textContent = decision.text;
    btn.onclick = () => makeChoice(idx);
    choicesDiv.appendChild(btn);
  });
}

// --- Terrain and Character Drawing (unchanged, but add village) ---
function drawVillage() {
  // Draw some huts and a well
  for (let i = 0; i < 3; i++) {
    // Hut base
    ctx.fillStyle = "#F9E4B7"; // Sand
    ctx.fillRect(120 + i * 120, 220, 60, 50);
    // Roof
    ctx.beginPath();
    ctx.moveTo(120 + i * 120, 220);
    ctx.lineTo(150 + i * 120, 190);
    ctx.lineTo(180 + i * 120, 220);
    ctx.closePath();
    ctx.fillStyle = "#8D6748"; // Earth Brown
    ctx.fill();
    // Door
    ctx.fillStyle = "#FFD600"; // Accent Yellow
    ctx.fillRect(145 + i * 120, 250, 15, 20);
  }
  // Well
  ctx.beginPath();
  ctx.arc(500, 260, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#4DD0E1"; // Aqua
  ctx.fill();
  ctx.fillStyle = "#64B5F6"; // Sky Blue
  ctx.fillRect(482, 260, 36, 10);
  ctx.fillStyle = "#1A237E"; // Deep Blue
  ctx.fillRect(495, 250, 10, 20);
}

// Character state
const character = {
  x: 50,
  y: 0,
  width: 24,
  height: 36,
  direction: 1, // 1 = right, -1 = left
  walking: true
};

// Generate realistic terrain using layered noise
function generateTerrain(width) {
  const points = [];
  for (let x = 0; x <= width; x++) {
    // Layered sine/cosine for more realism
    let y = 300
      + 40 * Math.sin(x / 80)
      + 25 * Math.cos(x / 55)
      + 18 * Math.sin(x / 23)
      + 10 * Math.cos(x / 13)
      + 6 * Math.sin(x / 7);
    points.push(y);
  }
  return points;
}
const terrainProfile = [];

// Responsive canvas and terrain
function resizeCanvasAndTerrain() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Regenerate terrain for new width
  terrainProfile.length = 0;
  const newProfile = generateTerrain(canvas.width);
  for (let i = 0; i < newProfile.length; i++) {
    terrainProfile[i] = newProfile[i];
  }
}
window.addEventListener('resize', resizeCanvasAndTerrain);
resizeCanvasAndTerrain();

function drawTerrain() {
  ctx.save();
  // Draw ground
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let x = 0; x <= canvas.width; x++) {
    ctx.lineTo(x, terrainProfile[x]);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  // Soil gradient
  const grd = ctx.createLinearGradient(0, 320, 0, canvas.height);
  grd.addColorStop(0, "#F9E4B7"); // Sand
  grd.addColorStop(1, "#8D6748"); // Earth Brown
  ctx.fillStyle = grd;
  ctx.fill();

  // Add rocks
  for (let i = 0; i < 30; i++) {
    let rx = Math.random() * canvas.width;
    let ry = terrainProfile[Math.floor(rx)] + 5 + Math.random() * 10;
    ctx.beginPath();
    ctx.arc(rx, ry, 3 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD600"; // Accent Yellow
    ctx.fill();
  }
  // Add grass
  for (let i = 0; i < 80; i++) {
    let gx = Math.random() * canvas.width;
    let gy = terrainProfile[Math.floor(gx)] - 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy - 10 - Math.random() * 8);
    ctx.strokeStyle = "#4DD0E1"; // Aqua
    ctx.lineWidth = 1 + Math.random();
    ctx.stroke();
  }
  ctx.restore();
}

// Simple stick figure character
function drawCharacter() {
  const { x, width, height } = character;
  // Find y based on terrain
  const baseY = terrainProfile[Math.floor(x)] || 300;
  const y = baseY - height;
  ctx.save();
  ctx.translate(x, y);
  // Body
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0); // head center
  ctx.arc(0, 0, 8, 0, Math.PI * 2); // head
  ctx.moveTo(0, 8); // neck
  ctx.lineTo(0, 24); // body
  // Arms
  ctx.moveTo(0, 12);
  ctx.lineTo(-10, 20);
  ctx.moveTo(0, 12);
  ctx.lineTo(10, 20);
  // Legs
  ctx.moveTo(0, 24);
  ctx.lineTo(-8, 36);
  ctx.moveTo(0, 24);
  ctx.lineTo(8, 36);
  ctx.stroke();
  ctx.restore();
}

// Animate character walking left/right
function updateCharacter() {
  if (!character.walking) return;
  character.x += character.direction * 2.2;
  // Reverse direction at edges
  if (character.x > canvas.width - 30) character.direction = -1;
  if (character.x < 30) character.direction = 1;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTerrain();
  if (gamePhase === "playing" && !character.walking) {
    drawVillage();
  }
  drawCharacter();
}

// --- Game Loop (only runs if playing) ---
function gameLoop() {
  if (gamePhase === "playing") {
    updateCharacter();
    drawGame();
  }
  requestAnimationFrame(gameLoop);
}

// --- Start Game (advanced: only after intro) ---
function startGame() {
  updateBars();
  renderChoices();
  document.getElementById('game-message').textContent = "";
  gameLoop();
}

// --- Initial Setup ---
barsDiv.style.display = "none";
choicesDiv.style.display = "none";
gameLoop();

// Add this after DOMContentLoaded or at the top-level if .main-header exists at load time
document.addEventListener("DOMContentLoaded", () => {
  const logoBox = document.querySelector('.logo-box');
  if (logoBox) {
    logoBox.innerHTML = `<img src="waterlogo2.png" alt="Water Warrior Logo" class="main-logo">`;
  }
});

