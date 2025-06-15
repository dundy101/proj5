document.addEventListener("DOMContentLoaded", () => {
  // Menu logic
  const menuOverlay = document.getElementById('game-menu-overlay');
  const startBtn = document.getElementById('start-game-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const creditsBtn = document.getElementById('credits-btn');
  const menuExtra = document.getElementById('menu-extra');

  // --- Game State ---
  let state = {
    health: 100,
    hunger: 100,
    thirst: 100
  };

  // --- Game UI Elements ---
  let gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    document.body.appendChild(gameContainer);
  }

  function updateStatsBar() {
    let bar = document.getElementById('stats-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'stats-bar';
      bar.style.margin = '1em auto 0 auto';
      bar.style.textAlign = 'center';
      bar.style.fontWeight = 'bold';
      bar.style.fontSize = '1.1em';
      bar.style.letterSpacing = '0.04em';
      bar.style.maxWidth = '98vw'; // mobile friendly
      gameContainer.prepend(bar);
    }
    bar.innerHTML = `
      <span style="color:#388e3c;">Health: ${state.health}</span> &nbsp; 
      <span style="color:#fbc02d;">Hunger: ${state.hunger}</span> &nbsp; 
      <span style="color:#0288d1;">Thirst: ${state.thirst}</span>
    `;
  }

  function getRandomOptions() {
    // Add more options for variety if desired
    const allOptions = [
      {
        text: "Drink water from a jug",
        effects: { thirst: +25, hunger: -5, health: 0 },
        desc: "You quench your thirst, but your stomach grumbles."
      },
      {
        text: "Eat leftover bread",
        effects: { hunger: +15, thirst: -5, health: 0 },
        desc: "You eat some bread, but feel a bit thirsty."
      },
      {
        text: "Do morning stretches",
        effects: { health: +10, hunger: -5, thirst: -5 },
        desc: "You feel healthier, but a bit hungrier and thirstier."
      },
      {
        text: "Go outside for fresh air",
        effects: { health: +5, hunger: -3, thirst: -3 },
        desc: "The fresh air invigorates you, but you feel a bit hungry and thirsty."
      },
      {
        text: "Skip breakfast",
        effects: { hunger: -15, thirst: 0, health: -5 },
        desc: "You skip breakfast. You feel a bit weak and hungry."
      },
      {
        text: "Wash your face",
        effects: { health: +3, hunger: 0, thirst: -2 },
        desc: "You feel refreshed, but a little thirstier."
      }
    ];
    // Shuffle and pick 3
    const shuffled = allOptions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  function showOptions() {
    updateStatsBar();
    const options = getRandomOptions();

    let html = `<div class="game-text"><h2>What will you do next?</h2></div><div class="game-options">`;
    options.forEach((opt, i) => {
      html += `<button class="menu-btn game-option-btn" data-idx="${i}" style="font-size:1.15em;min-height:3.2em;">${opt.text}</button>`;
    });
    html += `</div><div id="option-result" class="game-result"></div>`;
    gameContainer.innerHTML = html;
    updateStatsBar();
    showResetButton();

    document.querySelectorAll('.game-option-btn').forEach(btn => {
      const handler = (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const opt = options[idx];
        state.health = Math.max(0, Math.min(100, state.health + opt.effects.health));
        state.hunger = Math.max(0, Math.min(100, state.hunger + opt.effects.hunger));
        state.thirst = Math.max(0, Math.min(100, state.thirst + opt.effects.thirst));
        updateStatsBar();
        document.getElementById('option-result').innerHTML = `<p>${opt.desc}</p>`;
        document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);

        // After a short delay, show new options or game over
        setTimeout(() => {
          if (state.health <= 0) {
            showGameOver("You ran out of health!");
          } else if (state.hunger <= 0) {
            showGameOver("You ran out of food!");
          } else if (state.thirst <= 0) {
            showGameOver("You ran out of water!");
          } else {
            showOptions();
          }
        }, 1200);
      };
      btn.onclick = handler;
      btn.ontouchstart = function(e) { e.preventDefault(); handler(e); };
    });
  }

  function showGameOver(reason) {
    gameContainer.innerHTML = `
      <div class="game-event" style="background:#ffeaea;">
        <div class="game-text">
          <h2 style="color:#e53935;">Game Over</h2>
          <p>${reason}</p>
          <button class="menu-btn" id="restart-btn" style="font-size:1.15em;min-height:3.2em;">Restart</button>
        </div>
      </div>
    `;
    updateStatsBar();
    showResetButton();
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      const handler = () => startNewGame();
      restartBtn.onclick = handler;
      restartBtn.ontouchstart = function(e) { e.preventDefault(); handler(e); };
    }
  }

  function startNewGame() {
    // Hide menu
    menuOverlay.style.display = "none";
    // Show game container, clear previous
    gameContainer.style.display = "flex";
    gameContainer.style.flexDirection = "column";
    gameContainer.style.alignItems = "center";
    gameContainer.style.width = "100%";
    gameContainer.style.maxWidth = "100vw";
    gameContainer.innerHTML = `
      <div class="game-event" id="wake-up-event" style="background:#fff7e1;">
        <div class="game-scene">
          <img src="bed.png" alt="Bed" class="game-scene-img">
        </div>
        <div class="game-text">
          <h2>You wake up in a small hut in a remote village.</h2>
          <p>The sun is rising. It's time to get up and start your day.</p>
          <button class="menu-btn" id="get-up-btn" style="font-size:1.15em;min-height:3.2em;">Get Up</button>
        </div>
      </div>
    `;
    state = { health: 100, hunger: 100, thirst: 100 };
    updateStatsBar();
    showResetButton();

    const getUpBtn = document.getElementById('get-up-btn');
    if (getUpBtn) {
      const handler = () => showOptions();
      getUpBtn.onclick = handler;
      getUpBtn.ontouchstart = function(e) { e.preventDefault(); handler(e); };
    }
  }

  function showResetButton() {
    let resetBtn = document.getElementById('reset-btn');
    if (!resetBtn) {
      resetBtn = document.createElement('button');
      resetBtn.id = 'reset-btn';
      resetBtn.className = 'menu-btn';
      resetBtn.style.marginTop = '1.5em';
      resetBtn.style.background = 'linear-gradient(90deg, #e57373 0%, #fbc02d 100%)';
      resetBtn.style.color = '#fff';
      resetBtn.innerText = 'Reset';
      resetBtn.onclick = showMenu;
      resetBtn.ontouchstart = function(e) { e.preventDefault(); showMenu(); };
      gameContainer.appendChild(resetBtn);
    }
  }

  function removeResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn && resetBtn.parentNode) {
      resetBtn.parentNode.removeChild(resetBtn);
    }
  }

  function showMenu() {
    // Hide game container, show menu overlay
    gameContainer.style.display = "none";
    menuOverlay.style.display = "flex";
    removeResetButton();
    // Optionally clear gameContainer
    gameContainer.innerHTML = '';
    // Optionally clear menuExtra
    menuExtra.innerHTML = '';
  }

  if (startBtn) {
    startBtn.onclick = () => {
      startNewGame();
    };
  }
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      menuExtra.innerHTML = `
        <b>Settings</b>
        <div class="settings-group">
          <label>
            <input type="checkbox" id="sfx-toggle" checked>
            <span>SFX</span>
          </label>
          <label>
            <input type="checkbox" id="music-toggle" checked>
            <span>Music</span>
          </label>
          <label>
            <input type="checkbox" id="fullscreen-toggle">
            <span>Fullscreen</span>
          </label>
          <label>
            <input type="checkbox" id="notifications-toggle" checked>
            <span>Notifications</span>
          </label>
        </div>
      `;
    };
  }
  if (creditsBtn) {
    creditsBtn.onclick = () => {
      menuExtra.innerHTML = `
        <b>Credits</b><br>
        <span>Game Design: Andy Hong<br>Art & UI: Copilot<br>Powered by charity: water</span>
      `;
    };
  }
});