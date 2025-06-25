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

  // --- Difficulty State ---
  let difficulty = 'normal'; // 'easy', 'normal', 'hard'

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

  function getRandomStatChange() {
    if (difficulty === 'easy') return Math.floor(Math.random() * 8) + 3; // 3-10
    if (difficulty === 'hard') return Math.floor(Math.random() * 16) + 10; // 10-25
    return Math.floor(Math.random() * 11) + 5; // 5-15
  }

  // Remove grace period logic
  // let graceTurn = true; // (delete this line)

  function getRandomOptions() {
    const allOptions = [
      { text: "Drink water from a jug", effects: { thirst: getRandomStatChange(), hunger: -getRandomStatChange(), health: 0 }, desc: "You quench your thirst, but your stomach grumbles." },
      { text: "Eat leftover bread", effects: { hunger: getRandomStatChange(), thirst: -getRandomStatChange(), health: 0 }, desc: "You eat some bread, but feel a bit thirsty." },
      { text: "Do morning stretches", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You feel healthier, but a bit hungrier and thirstier." },
      { text: "Go outside for fresh air", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "The fresh air invigorates you, but you feel a bit hungry and thirsty." },
      { text: "Skip breakfast", effects: { hunger: -getRandomStatChange(), thirst: 0, health: -getRandomStatChange() }, desc: "You skip breakfast. You feel a bit weak and hungry." },
      { text: "Wash your face", effects: { health: getRandomStatChange(), hunger: 0, thirst: -getRandomStatChange() }, desc: "You feel refreshed, but a little thirstier." },
      { text: "Eat some fruit", effects: { hunger: getRandomStatChange(), thirst: getRandomStatChange(), health: 0 }, desc: "You eat fruit, feeling refreshed and less hungry." },
      { text: "Rest in the shade", effects: { health: getRandomStatChange(), hunger: 0, thirst: -getRandomStatChange() }, desc: "You rest and recover, but get a bit thirsty." },
      { text: "Visit the river", effects: { thirst: getRandomStatChange(), health: getRandomStatChange(), hunger: -getRandomStatChange() }, desc: "You drink and wash at the river, but get hungry." },
      { text: "Milk the goat", effects: { hunger: getRandomStatChange(), thirst: getRandomStatChange(), health: 0 }, desc: "You get fresh milk, feeling less hungry and thirsty." },
      { text: "Feed the animals", effects: { hunger: -getRandomStatChange(), health: getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You care for animals, feeling good but using energy." },
      { text: "Play with children", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You play and laugh, but use up some energy." },
      { text: "Help a neighbor", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "Helping others lifts your spirits, but you use energy." },
      { text: "Tend the garden", effects: { hunger: -getRandomStatChange(), thirst: -getRandomStatChange(), health: getRandomStatChange() }, desc: "You work in the garden. It's healthy, but tiring." },
      { text: "Prepare a meal", effects: { hunger: getRandomStatChange(), thirst: -getRandomStatChange(), health: 0 }, desc: "You cook and eat, but get a bit thirsty." },
      { text: "Take a nap", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You nap and recover, but wake up a bit hungry and thirsty." },
      { text: "Collect firewood", effects: { health: -getRandomStatChange(), hunger: -getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You gather wood, but it's hard work." },
      { text: "Chop vegetables", effects: { hunger: getRandomStatChange(), thirst: -getRandomStatChange(), health: 0 }, desc: "You prepare food, but get thirsty." },
      { text: "Grind grain", effects: { hunger: getRandomStatChange(), thirst: -getRandomStatChange(), health: 0 }, desc: "You grind grain, but get thirsty." },
      { text: "Shell beans", effects: { hunger: getRandomStatChange(), thirst: -getRandomStatChange(), health: 0 }, desc: "You shell beans, but get thirsty." },
      { text: "Polish shoes", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: 0 }, desc: "You polish shoes, feeling neat but a bit hungry." },
      { text: "Make a broom", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: 0 }, desc: "You make a broom, feeling useful but a bit hungry." },
      { text: "Feed the dog", effects: { hunger: -getRandomStatChange(), health: getRandomStatChange(), thirst: -getRandomStatChange() }, desc: "You feed the dog, feeling good but use energy." },
      { text: "Organize supplies", effects: { health: getRandomStatChange(), hunger: -getRandomStatChange(), thirst: 0 }, desc: "You organize, feeling prepared but a bit hungry." },
      { text: "Check the weather", effects: { health: getRandomStatChange(), hunger: 0, thirst: -getRandomStatChange() }, desc: "You check the weather, feeling ready but a bit thirsty." }
    ];
    // Shuffle and pick 3
    let shuffled = allOptions.sort(() => 0.5 - Math.random());
    let picked = shuffled.slice(0, 3);
    // Ensure at least one option increases a stat every set
    if (!picked.some(opt => opt.effects.health > 0 || opt.effects.hunger > 0 || opt.effects.thirst > 0)) {
      const positive = allOptions.find(opt => opt.effects.health > 0 || opt.effects.hunger > 0 || opt.effects.thirst > 0);
      if (positive) picked[0] = positive;
    }
    return picked;
  }

  // --- 3D: Load realistic models and textures ---
  // Add GLTFLoader for three.js
  const loaderScript = document.createElement('script');
  loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/js/loaders/GLTFLoader.min.js';
  document.head.appendChild(loaderScript);

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
        // End grace period after first turn
        // graceTurn = false;
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

  // Milestone messages
  const milestones = [
    { condition: (s) => s.health === 100 && s.hunger === 100 && s.thirst === 100, message: "Amazing! All your stats are maxed out!" },
    { condition: (s) => s.health >= 90 && s.hunger >= 90 && s.thirst >= 90, message: "You're thriving in the village!" },
    { condition: (s) => s.health <= 30 || s.hunger <= 30 || s.thirst <= 30, message: "Warning: One of your stats is getting low!" }
  ];

  function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }

  function checkMilestones() {
    for (const m of milestones) {
      if (m.condition(state)) {
        showMilestoneMessage(m.message);
        break;
      }
    }
  }

  function showMilestoneMessage(msg) {
    let milestoneDiv = document.getElementById('milestone-message');
    if (!milestoneDiv) {
      milestoneDiv = document.createElement('div');
      milestoneDiv.id = 'milestone-message';
      milestoneDiv.style.position = 'fixed';
      milestoneDiv.style.top = '80px';
      milestoneDiv.style.left = '50%';
      milestoneDiv.style.transform = 'translateX(-50%)';
      milestoneDiv.style.background = '#fffbe8';
      milestoneDiv.style.color = '#1A237E';
      milestoneDiv.style.padding = '1em 2em';
      milestoneDiv.style.borderRadius = '12px';
      milestoneDiv.style.boxShadow = '0 2px 12px #0002';
      milestoneDiv.style.fontWeight = 'bold';
      milestoneDiv.style.zIndex = 2000;
      document.body.appendChild(milestoneDiv);
    }
    milestoneDiv.textContent = msg;
    milestoneDiv.style.display = 'block';
    setTimeout(() => { milestoneDiv.style.display = 'none'; }, 2500);
  }

  function showGameOver(reason) {
    playSound('audio-death');
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

  // Add three.js from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js';
  let threeLoaded = false;
  script.onload = () => { threeLoaded = true; };
  document.head.appendChild(script);

  function startNewGame() {
    // Hide menu
    menuOverlay.style.display = "none";
    // Show game container, clear previous
    gameContainer.style.display = "block";
    gameContainer.innerHTML = '<div id="threejs-container" style="width:100vw;height:calc(100vh - 60px);"></div>';
    state = { health: 100, hunger: 100, thirst: 100 };
    updateStatsBar();
    showResetButton();

    function tryStart3D() {
      if (window.THREE) {
        init3DGame();
      } else {
        setTimeout(tryStart3D, 50);
      }
    }
    tryStart3D();
  }

  function init3DGame() {
    // Set up scene
    const container = document.getElementById('threejs-container');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce6ff);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0xe0cda9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Bed (simple box)
    const bedGeo = new THREE.BoxGeometry(2, 0.4, 1);
    const bedMat = new THREE.MeshLambertMaterial({ color: 0x8d5524 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, 0.2, -2);
    scene.add(bed);

    // Man (simple shapes)
    const man = new THREE.Group();
    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 16);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1976d2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7/2 + 0.2;
    man.add(body);
    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffe0b2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.7 + 0.18 + 0.2;
    man.add(head);
    // Arms
    const armGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 12);
    const armMat = new THREE.MeshLambertMaterial({ color: 0xffe0b2 });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.25, 0.7, 0);
    leftArm.rotation.z = Math.PI / 4;
    man.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.25, 0.7, 0);
    rightArm.rotation.z = -Math.PI / 4;
    man.add(rightArm);
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.09, 0.25, 0);
    man.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.09, 0.25, 0);
    man.add(rightLeg);
    man.position.set(0, 0, -2);
    scene.add(man);

    // Animate waking up
    let wakeProgress = 0;
    function animateWakeUp() {
      if (wakeProgress < 1) {
        man.rotation.x = -Math.PI/2 * (1 - wakeProgress);
        wakeProgress += 0.02;
        renderer.render(scene, camera);
        requestAnimationFrame(animateWakeUp);
      } else {
        man.rotation.x = 0;
        renderer.render(scene, camera);
        showThoughtBubble();
      }
    }
    animateWakeUp();

    // Thought bubble with options
    function showThoughtBubble() {
      // Remove any existing bubble
      let oldBubble = document.getElementById('thought-bubble');
      if (oldBubble) oldBubble.remove();
      // Create HTML overlay for options
      let bubble = document.createElement('div');
      bubble.id = 'thought-bubble';
      bubble.style.position = 'absolute';
      bubble.style.left = '50%';
      bubble.style.top = '120px';
      bubble.style.transform = 'translateX(-50%)';
      bubble.style.background = 'rgba(255,255,255,0.97)';
      bubble.style.borderRadius = '22px';
      bubble.style.boxShadow = '0 2px 16px #0002';
      bubble.style.padding = '1.2em 2em';
      bubble.style.minWidth = '260px';
      bubble.style.textAlign = 'center';
      bubble.style.zIndex = 2000;
      bubble.innerHTML = `<h3 style='color:#1976d2;margin-bottom:0.7em;'>What will you do?</h3>`;
      const options = getRandomOptions();
      options.forEach((opt, i) => {
        let btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.style.margin = '0.5em 0';
        btn.style.fontSize = '1.1em';
        btn.innerText = opt.text;
        btn.onclick = () => {
          bubble.remove();
          // Update stats
          state.health = Math.max(0, Math.min(100, state.health + opt.effects.health));
          state.hunger = Math.max(0, Math.min(100, state.hunger + opt.effects.hunger));
          state.thirst = Math.max(0, Math.min(100, state.thirst + opt.effects.thirst));
          updateStatsBar();
          // Check for game over
          if (state.health <= 0 || state.hunger <= 0 || state.thirst <= 0) {
            show3DGameOver();
          } else {
            // Show next options after a short delay
            setTimeout(showThoughtBubble, 900);
          }
        };
        bubble.appendChild(btn);
      });
      document.body.appendChild(bubble);
    }

    function show3DGameOver() {
      // Remove any existing bubble
      let oldBubble = document.getElementById('thought-bubble');
      if (oldBubble) oldBubble.remove();
      // Overlay
      let over = document.createElement('div');
      over.id = 'gameover-overlay';
      over.style.position = 'fixed';
      over.style.left = '0';
      over.style.top = '0';
      over.style.width = '100vw';
      over.style.height = '100vh';
      over.style.background = 'rgba(255,255,255,0.97)';
      over.style.display = 'flex';
      over.style.flexDirection = 'column';
      over.style.alignItems = 'center';
      over.style.justifyContent = 'center';
      over.style.zIndex = 3000;
      over.innerHTML = `
        <div style="background:#fff;border-radius:18px;box-shadow:0 4px 32px #0002;padding:2em 2.5em 1.5em 2.5em;text-align:center;max-width:95vw;">
          <h2 style="color:#e53935;">Game Over</h2>
          <p style="color:#1a237e;">You ran out of health, hunger, or thirst.</p>
          <button class="menu-btn" id="restart-btn-3d" style="font-size:1.15em;min-height:3.2em;margin:0.7em 0;">Restart</button>
          <a href="index.html" class="menu-btn" style="font-size:1.15em;min-height:3.2em;background:linear-gradient(90deg,#4DD0E1 0%,#FFD600 100%);color:#1A237E;text-decoration:none;display:inline-block;">Back to Homepage</a>
        </div>
      `;
      document.body.appendChild(over);
      document.getElementById('restart-btn-3d').onclick = () => {
        over.remove();
        startNewGame();
      };
    }
    // Try to load realistic man and environment
    function loadRealisticScene(scene, camera, renderer) {
      // Load a realistic man model (GLB/GLTF)
      if (window.THREE && window.THREE.GLTFLoader) {
        const gltfLoader = new THREE.GLTFLoader();
        // Example free model URLs (replace with your own for best results)
        const manUrl = 'https://models.babylonjs.com/CesiumMan/glTF/CesiumMan.gltf';
        const hutUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Hut/glTF/Hut.gltf';
        gltfLoader.load(hutUrl, function(gltf) {
          gltf.scene.position.set(0, 0, 0);
          scene.add(gltf.scene);
        });
        gltfLoader.load(manUrl, function(gltf) {
          gltf.scene.position.set(0, 0, -2);
          gltf.scene.scale.set(1.2, 1.2, 1.2);
          scene.add(gltf.scene);
        });
      }
    }
    // After setting up the basic scene, try to load realistic models
    loaderScript.onload = () => {
      loadRealisticScene(scene, camera, renderer);
    };
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

  function showDifficultyMenu() {
    menuOverlay.style.display = "flex";
    gameContainer.style.display = "none";
    menuExtra.innerHTML = '';
    const diffDiv = document.createElement('div');
    diffDiv.className = 'menu-content';
    diffDiv.style.marginTop = '1.5em';
    diffDiv.innerHTML = `
      <h2>Choose Difficulty</h2>
      <button class="menu-btn" id="easy-btn">Easy</button>
      <button class="menu-btn" id="normal-btn">Normal</button>
      <button class="menu-btn" id="hard-btn">Hard</button>
    `;
    menuOverlay.appendChild(diffDiv);
    document.getElementById('easy-btn').onclick = () => { difficulty = 'easy'; diffDiv.remove(); startNewGame(); };
    document.getElementById('normal-btn').onclick = () => { difficulty = 'normal'; diffDiv.remove(); startNewGame(); };
    document.getElementById('hard-btn').onclick = () => { difficulty = 'hard'; diffDiv.remove(); startNewGame(); };
  }

  if (startBtn) {
    startBtn.onclick = () => {
      showDifficultyMenu();
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