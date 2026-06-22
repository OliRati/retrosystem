import {
    createWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

const STORAGE_KEY = "retrosystem_invaders_hi_scores";
let invadersWindowOpened = false;

function invadersWindow() {
    function onCloseWindow() {
        invadersWindowOpened = false;
        cleanupGame();
        return true;
    }

    if (invadersWindowOpened) return;
    invadersWindowOpened = true;

    const newWin = createWindow("invadersWindow", "Invaders", -1, -1, 300, 410, WINMASK_MOVABLE | WINMASK_CLOSABLE, onCloseWindow);
    newSystemStatus("Opening invaders...");

    const windowContent = newWin.querySelector("#invadersWindow") || newWin.querySelector(".margincontainer");
    if (!windowContent) return;

    windowContent.innerHTML = "";
    windowContent.style.display = "flex";
    windowContent.style.flexDirection = "column";
    windowContent.style.height = "100%";
    windowContent.style.gap = "10px";
    windowContent.style.boxSizing = "border-box";

    const statusRow = document.createElement("div");
    statusRow.style.display = "flex";
    statusRow.style.justifyContent = "space-between";
    statusRow.style.alignItems = "center";
    statusRow.style.gap = "8px";

    const infoBlock = document.createElement("div");
    infoBlock.style.display = "flex";
    infoBlock.style.gap = "8px";
    infoBlock.style.flexWrap = "wrap";

    const scoreLabel = createInfoLabel("Score", "0");
    const levelLabel = createInfoLabel("Level", "1");
    const livesLabel = createInfoLabel("Lifes", "3");
    const statusLabel = createInfoLabel("State", "Ready");

    infoBlock.append(scoreLabel.container, levelLabel.container, livesLabel.container, statusLabel.container);

    const controlBlock = document.createElement("div");
    controlBlock.style.display = "flex";
    controlBlock.style.gap = "6px";
    controlBlock.style.flexWrap = "wrap";

    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.textContent = "Play";
    startButton.style.flex = "1";
    startButton.style.minWidth = "90px";
    // Prevent the start button from receiving focus so space/enter won't trigger it
    startButton.tabIndex = -1;

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.disabled = true;
    pauseButton.style.flex = "1";
    pauseButton.style.minWidth = "90px";

    controlBlock.append(startButton, pauseButton);
    statusRow.append(infoBlock, controlBlock);
    windowContent.appendChild(statusRow);

    const canvasWrapper = document.createElement("div");
    canvasWrapper.style.flex = "1";
    canvasWrapper.style.display = "flex";
    canvasWrapper.style.justifyContent = "center";
    canvasWrapper.style.alignItems = "center";

    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 260;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.background = "#000";
    canvas.style.display = "block";
    canvas.style.border = "1px solid #999";
    canvas.style.borderRadius = "4px";

    canvasWrapper.appendChild(canvas);
    windowContent.appendChild(canvasWrapper);

    const footerRow = document.createElement("div");
    footerRow.style.display = "flex";
    footerRow.style.flexDirection = "column";
    footerRow.style.gap = "8px";

    const instructions = document.createElement("div");
    instructions.textContent = "Touches : ← → pour bouger, Espace pour tirer. Cliquez dans la fenêtre pour reprendre le jeu.";
    instructions.style.fontSize = "12px";
    instructions.style.color = "#ddd";
    instructions.style.minHeight = "1.2em";

    const scoreBoard = document.createElement("div");
    scoreBoard.style.display = "grid";
    scoreBoard.style.gridTemplateColumns = "1fr 1fr";
    scoreBoard.style.gap = "6px";
    scoreBoard.style.fontSize = "12px";
    scoreBoard.style.color = "#eee";
    scoreBoard.style.alignItems = "flex-start";

    const hiScoreTitle = document.createElement("div");
    hiScoreTitle.textContent = "Meilleurs scores";
    hiScoreTitle.style.fontWeight = "bold";
    hiScoreTitle.style.gridColumn = "1 / -1";

    const hiScoreList = document.createElement("div");
    hiScoreList.style.display = "grid";
    hiScoreList.style.rowGap = "2px";
    hiScoreList.style.gridColumn = "1 / -1";

    scoreBoard.append(hiScoreTitle, hiScoreList);
    footerRow.append(instructions, scoreBoard);
    windowContent.appendChild(footerRow);

    const ctx = canvas.getContext("2d");

    const state = {
        started: false,
        running: false,
        paused: false,
        score: 0,
        level: 1,
        lives: 3,
        bullets: [],
        bombs: [],
        aliens: [],
        explosions: [],
        bunkers: [],
        alienDirection: 1,
        alienSpeed: 0.4,
        alienDrop: 15,
        shootCooldown: 0,
        lastFrame: 0,
        waveComplete: false,
        active: true,
        animationFrame: null,
        highScores: loadHighScores(),
        activeWindow: newWin
    };

    const constants = {
        playerWidth: 30,
        playerHeight: 10,
        playerSpeed: 3.8,
        bulletSpeed: 6,
        bombSpeed: 1.6,
        bombSpeedIncreasePerLevel: 0.06,
        // Adjusted to be a bit more compact like original
        alienWidth: 20,
        alienHeight: 14,
        alienPaddingX: 8,
        alienPaddingY: 10,
        alienMargin: 12,
        // Dynamic speed parameters (tuned for classic pacing)
        alienBaseSpeed: 0.12,
        alienSpeedRange: 1.6,
        playerY: canvas.height - 24,
        maxRows: 5,
        maxCols: 10,
        maxHighScores: 5,
        bombChance: 0.004,
        bunkerCount: 3,
        bunkerWidth: 34,
        bunkerHeight: 16,
        bunkerSpacing: 30,
        bunkerHealth: 4,
        scoreByType: [100, 60, 30]
    };

    const player = {
        x: canvas.width / 2 - constants.playerWidth / 2,
        y: constants.playerY,
        width: constants.playerWidth,
        height: constants.playerHeight
    };

    const controls = {
        left: false,
        right: false,
        shoot: false
    };

    const messageOverlay = document.createElement("div");
    messageOverlay.style.position = "absolute";
    messageOverlay.style.top = "0";
    messageOverlay.style.left = "0";
    messageOverlay.style.right = "0";
    messageOverlay.style.bottom = "0";
    messageOverlay.style.display = "flex";
    messageOverlay.style.alignItems = "center";
    messageOverlay.style.justifyContent = "center";
    messageOverlay.style.pointerEvents = "none";
    messageOverlay.style.color = "#fff";
    messageOverlay.style.fontFamily = "monospace";
    messageOverlay.style.fontSize = "18px";
    messageOverlay.style.textAlign = "center";
    messageOverlay.style.padding = "10px";
    messageOverlay.style.background = "rgba(0,0,0,0.35)";
    messageOverlay.textContent = "";
    canvasWrapper.style.position = "relative";
    canvasWrapper.appendChild(messageOverlay);

    function createInfoLabel(label, value) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.minWidth = "70px";
        container.style.fontSize = "12px";
        container.style.color = "#ddd";

        const title = document.createElement("span");
        title.textContent = label;
        title.style.fontWeight = "bold";
        title.style.color = "#fff";

        const field = document.createElement("span");
        field.textContent = value;
        field.style.marginTop = "2px";

        container.append(title, field);
        return {container, field};
    }

    function loadHighScores() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed.slice(0, constants.maxHighScores) : [];
        } catch (error) {
            return [];
        }
    }

    function saveHighScores() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.highScores.slice(0, constants.maxHighScores)));
    }

    function addHighScore(score) {
        state.highScores.push(score);
        state.highScores.sort((a, b) => b - a);
        state.highScores = state.highScores.slice(0, constants.maxHighScores);
        saveHighScores();
    }

    function updateHighScoreDisplay() {
        hiScoreList.innerHTML = "";
        if (state.highScores.length === 0) {
            const emptyLine = document.createElement("div");
            emptyLine.textContent = "Aucun score enregistré.";
            hiScoreList.appendChild(emptyLine);
            return;
        }
        state.highScores.forEach((score, index) => {
            const line = document.createElement("div");
            line.textContent = `${index + 1}. ${score}`;
            hiScoreList.appendChild(line);
        });
    }

    function buildAliens(level) {
        const rows = Math.min(constants.maxRows, 2 + level);
        const cols = Math.min(constants.maxCols, 5 + Math.floor(level / 2));
        const aliens = [];
        const totalWidth = cols * constants.alienWidth + (cols - 1) * constants.alienPaddingX;
        const offsetX = Math.max(0, Math.floor((canvas.width - totalWidth) / 2));
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const type = row === 0 ? 0 : row === 1 ? 1 : 2;
                aliens.push({
                    x: offsetX + col * (constants.alienWidth + constants.alienPaddingX),
                    y: constants.alienMargin + row * (constants.alienHeight + constants.alienPaddingY),
                    row,
                    type,
                    alive: true
                });
            }
        }
        return aliens;
    }

    function buildBunkers() {
        const bunkers = [];
        const totalWidth = constants.bunkerCount * constants.bunkerWidth + (constants.bunkerCount - 1) * constants.bunkerSpacing;
        const startX = Math.max(10, Math.floor((canvas.width - totalWidth) / 2));
        // Place bunkers between player and aliens, using player's Y to compute sensible vertical position
        const bunkerY = Math.max(10, player.y - constants.bunkerHeight - 22);

        for (let index = 0; index < constants.bunkerCount; index++) {
            bunkers.push({
                x: startX + index * (constants.bunkerWidth + constants.bunkerSpacing),
                y: bunkerY,
                width: constants.bunkerWidth,
                height: constants.bunkerHeight,
                health: constants.bunkerHealth
            });
        }
        return bunkers;
    }

    function resetGame() {
        state.started = true;
        state.running = true;
        state.paused = false;
        state.score = 0;
        state.level = 1;
        state.lives = 3;
        state.bullets = [];
        state.bombs = [];
        state.aliens = buildAliens(state.level);
        // Track initial alien count for speed scaling
        state.initialAlienCount = state.aliens.filter(a => a.alive).length || 1;
        // start with base speed
        state.alienSpeed = constants.alienBaseSpeed;
        state.bunkers = buildBunkers();
        state.alienDirection = 1;
        state.alienSpeed = 0.4;
        state.alienDrop = 15;
        state.shootCooldown = 0;
        player.x = canvas.width / 2 - constants.playerWidth / 2;
        statusLabel.field.textContent = "Playing";
        pauseButton.disabled = false;
        pauseButton.textContent = "Pause";
        updateInfoDisplay();
        updateHighScoreDisplay();
        messageOverlay.textContent = "";
        if (!state.animationFrame) {
            state.animationFrame = window.requestAnimationFrame(gameLoop);
        }
    }

    function nextLevel() {
        state.level += 1;
        state.bullets = [];
        state.bombs = [];
        state.aliens = buildAliens(state.level);
        state.bunkers = buildBunkers();
        state.alienDirection = 1;
        state.initialAlienCount = state.aliens.filter(a => a.alive).length || 1;
        state.alienSpeed = constants.alienBaseSpeed + (state.level - 1) * 0.06;
        state.shootCooldown = 0;
        messageOverlay.textContent = `Niveau ${state.level}`;
        setTimeout(() => {
            if (!state.paused && state.running) messageOverlay.textContent = "";
        }, 1000);
    }

    function gameOver() {
        state.running = false;
        state.paused = false;
        statusLabel.field.textContent = "Ended";
        messageOverlay.textContent = "GAME OVER";
        pauseButton.disabled = true;
        startButton.textContent = "Play";
        addHighScore(state.score);
        updateHighScoreDisplay();
    }

    function pauseGame(reason) {
        if (!state.running || state.paused) return;
        state.paused = true;
        statusLabel.field.textContent = "Pause";
        pauseButton.textContent = "Continue";
        if (reason) messageOverlay.textContent = reason;
    }

    function resumeGame() {
        if (!state.running || !state.paused) return;
        state.paused = false;
        statusLabel.field.textContent = "En jeu";
        pauseButton.textContent = "Pause";
        if (messageOverlay.textContent === "Lost focus") messageOverlay.textContent = "";
        state.animationFrame = window.requestAnimationFrame(gameLoop);
    }

    function updateInfoDisplay() {
        scoreLabel.field.textContent = String(state.score);
        levelLabel.field.textContent = String(state.level);
        livesLabel.field.textContent = String(state.lives);
    }

    function updateState(delta) {
        if (!state.running || state.paused) return;

        if (controls.left) {
            player.x -= constants.playerSpeed * delta;
        }
        if (controls.right) {
            player.x += constants.playerSpeed * delta;
        }
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

        if (controls.shoot && state.shootCooldown <= 0 && state.bullets.length < 1) {
            state.bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 10, width: 4, height: 10 });
            state.shootCooldown = 16;
        }
        if (state.shootCooldown > 0) state.shootCooldown -= delta;

        state.bullets.forEach(bullet => {
            bullet.y -= constants.bulletSpeed * delta;
        });

        state.bunkers.forEach(bunker => {
            if (bunker.health <= 0) return;
            state.bullets.forEach(bullet => {
                if (bullet.x < bunker.x + bunker.width && bullet.x + bullet.width > bunker.x && bullet.y < bunker.y + bunker.height && bullet.y + bullet.height > bunker.y) {
                    bunker.health -= 1;
                    bullet.y = -100;
                }
            });
        });

        state.bullets = state.bullets.filter(bullet => bullet.y + bullet.height > 0);

        state.bombs.forEach(bomb => {
            bomb.y += (constants.bombSpeed + state.level * constants.bombSpeedIncreasePerLevel) * delta;
        });

        state.bunkers.forEach(bunker => {
            if (bunker.health <= 0) return;
            state.bombs.forEach(bomb => {
                if (bomb.x < bunker.x + bunker.width && bomb.x + bomb.width > bunker.x && bomb.y < bunker.y + bunker.height && bomb.y + bomb.height > bunker.y) {
                    bunker.health -= 1;
                    bomb.y = canvas.height + 10;
                }
            });
        });

        state.bombs = state.bombs.filter(bomb => bomb.y < canvas.height);

        // Update explosions lifetime
        state.explosions.forEach(ex => {
            ex.t += delta;
        });
        state.explosions = state.explosions.filter(ex => ex.t < ex.max);

        const edge = state.aliens.reduce((acc, alien) => {
            if (!alien.alive) return acc;
            acc.min = Math.min(acc.min, alien.x);
            acc.max = Math.max(acc.max, alien.x + constants.alienWidth);
            return acc;
        }, { min: canvas.width, max: 0 });

        // Recalculate speed dynamically based on remaining aliens to emulate classic behaviour
        const aliveAliens = state.aliens.filter(a => a.alive);
        const aliveCount = aliveAliens.length;
        if (state.initialAlienCount && aliveCount > 0) {
            const killedRatio = 1 - (aliveCount / state.initialAlienCount);
            let computed = constants.alienBaseSpeed + killedRatio * constants.alienSpeedRange + (state.level - 1) * 0.06;
            // Cap speed to avoid becoming impossibly fast
            const maxSpeed = constants.alienBaseSpeed + constants.alienSpeedRange + (state.level - 1) * 0.12;
            state.alienSpeed = Math.min(computed, maxSpeed);
        }

        const moveDistance = state.alienSpeed * delta;

        // If no aliens alive, skip movement logic (safety guard)
        if (aliveCount > 0) {
            const dx = moveDistance * state.alienDirection;
            const minX = Math.min(...aliveAliens.map(alien => alien.x));
            const maxX = Math.max(...aliveAliens.map(alien => alien.x + constants.alienWidth));
            const nextMinX = minX + dx;
            const nextMaxX = maxX + dx;

            if (nextMinX < 0 || nextMaxX > canvas.width) {
                const correction = state.alienDirection === 1
                    ? Math.max(0, canvas.width - maxX)
                    : Math.max(0, -minX);
                state.aliens.forEach(alien => {
                    if (!alien.alive) return;
                    alien.x += correction;
                    alien.y += state.alienDrop;
                });
                state.alienDirection *= -1;
            } else {
                state.aliens.forEach(alien => {
                    if (!alien.alive) return;
                    alien.x += dx;
                });
            }
        }

        state.aliens.forEach(alien => {
            if (!alien.alive) return;
            if (Math.random() < constants.bombChance + state.level * 0.0015) {
                const dropX = alien.x + constants.alienWidth / 2 - 2;
                const dropY = alien.y + constants.alienHeight;
                state.bombs.push({ x: dropX, y: dropY, width: 4, height: 10 });
            }
                // draw/update explosions handled in draw/update loops
        });

        state.bullets.forEach(bullet => {
            state.aliens.forEach(alien => {
                if (!alien.alive) return;
                if (bullet.x < alien.x + constants.alienWidth && bullet.x + bullet.width > alien.x && bullet.y < alien.y + constants.alienHeight && bullet.y + bullet.height > alien.y) {
                    // create explosion at alien center
                    state.explosions.push({ x: alien.x + constants.alienWidth / 2, y: alien.y + constants.alienHeight / 2, t: 0, max: 8 });
                    alien.alive = false;
                    bullet.y = -100;
                    state.score += constants.scoreByType[alien.type] || 10;
                }
            });
        });

        state.bombs.forEach(bomb => {
            if (bomb.x < player.x + player.width && bomb.x + bomb.width > player.x && bomb.y + bomb.height > player.y && bomb.y < player.y + player.height) {
                // explosion on player hit
                state.explosions.push({ x: player.x + player.width / 2, y: player.y + player.height / 2, t: 0, max: 10 });
                bomb.y = canvas.height + 10;
                state.lives -= 1;
                if (state.lives <= 0) {
                    state.lives = 0;
                    gameOver();
                }
            }
        });

        const reached = state.aliens.some(alien => alien.alive && alien.y + constants.alienHeight >= player.y);
        if (reached) {
            gameOver();
        }

        if (aliveCount === 0) {
            nextLevel();
        }

        updateInfoDisplay();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#07101b");
        gradient.addColorStop(1, "#04141f");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = "#33ff33";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = "#fff";
        state.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        ctx.fillStyle = "#ff4f4f";
        state.bombs.forEach(bomb => {
            ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
        });

        state.bunkers.forEach(bunker => {
            if (bunker.health <= 0) return;
            const healthRatio = bunker.health / constants.bunkerHealth;
            const color = healthRatio > 0.66 ? "#6cc77d" : healthRatio > 0.33 ? "#c9b13f" : "#b84c3d";
            ctx.fillStyle = color;
            ctx.fillRect(bunker.x, bunker.y, bunker.width, bunker.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(bunker.x, bunker.y, bunker.width, bunker.height);
            ctx.fillStyle = "rgba(0,0,0,0.25)";
            for (let row = 1; row < 3; row++) {
                ctx.fillRect(bunker.x + 4, bunker.y + row * 5, bunker.width - 8, 2);
            }
        });

        state.aliens.forEach(alien => {
            if (!alien.alive) return;
            drawAlien(alien);
        });

        // Render explosions
        state.explosions.forEach(ex => {
            const progress = ex.t / ex.max;
            const radius = 2 + progress * 12;
            const alpha = 1 - progress;
            const grd = ctx.createRadialGradient(ex.x, ex.y, 0, ex.x, ex.y, radius);
            grd.addColorStop(0, `rgba(255,255,150,${alpha})`);
            grd.addColorStop(0.5, `rgba(255,100,32,${alpha * 0.9})`);
            grd.addColorStop(1, `rgba(0,0,0,0)`);
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(ex.x, ex.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        if (!state.running) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Debug overlay removed for production
    }

    function drawAlien(alien) {
        const baseX = alien.x;
        const baseY = alien.y;
        const bodyWidth = constants.alienWidth;
        const bodyHeight = constants.alienHeight;

        const colors = ["#4bd1ff", "#d96cff", "#ffb34c"];
        const fillColor = colors[alien.type] || colors[2];
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;

        ctx.beginPath();
        if (alien.type === 0) {
            ctx.rect(baseX + 3, baseY + 2, bodyWidth - 6, bodyHeight - 6);
            ctx.fill();
            drawAlienEyes(baseX + 6, baseY + 5);
            ctx.strokeRect(baseX + 3, baseY + 2, bodyWidth - 6, bodyHeight - 6);
        } else if (alien.type === 1) {
            ctx.moveTo(baseX + 2, baseY + bodyHeight - 2);
            ctx.lineTo(baseX + 4, baseY + 2);
            ctx.lineTo(baseX + bodyWidth - 4, baseY + 2);
            ctx.lineTo(baseX + bodyWidth - 2, baseY + bodyHeight - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            drawAlienEyes(baseX + 7, baseY + 8);
        } else {
            ctx.rect(baseX + 2, baseY + 3, bodyWidth - 4, bodyHeight - 6);
            ctx.fill();
            ctx.strokeRect(baseX + 2, baseY + 3, bodyWidth - 4, bodyHeight - 6);
            drawAlienEyes(baseX + 8, baseY + 6);
            ctx.fillStyle = "rgba(255,255,255,0.45)";
            ctx.fillRect(baseX + 6, baseY + bodyHeight - 4, 4, 2);
            ctx.fillRect(baseX + bodyWidth - 10, baseY + bodyHeight - 4, 4, 2);
        }
    }

    function drawAlienEyes(x, y) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 3, 3);
        ctx.fillRect(x + 8, y, 3, 3);
        ctx.fillStyle = "#000";
        ctx.fillRect(x + 1, y + 1, 1, 1);
        ctx.fillRect(x + 9, y + 1, 1, 1);
    }

    function gameLoop(timestamp) {
        if (!state.running) {
            state.animationFrame = null;
            draw();
            return;
        }
        if (!state.lastFrame) state.lastFrame = timestamp;
        const delta = Math.min(2, (timestamp - state.lastFrame) / 16.67);
        state.lastFrame = timestamp;

        if (!state.paused) {
            updateState(delta);
            draw();
        }

        state.animationFrame = window.requestAnimationFrame(gameLoop);
    }

    function handleWindowKeyDown(event) {
        if (!state.running || state.paused) return;
        switch (event.key) {
            case "ArrowLeft":
            case "a":
            case "A":
                controls.left = true;
                controls.right = false;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                controls.right = true;
                controls.left = false;
                break;
            case " ":
            case "Spacebar":
            case "Space":
                controls.shoot = true;
                break;
            default:
                break;
        }
    }

    function handleKeyUp(event) {
        if (!state.running) return;
        switch (event.key) {
            case "ArrowLeft":
            case "a":
            case "A":
                controls.left = false;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                controls.right = false;
                break;
            case " ":
            case "Spacebar":
            case "Space":
                controls.shoot = false;
                break;
            default:
                break;
        }
    }

    function handleDocumentMouseDown(event) {
        if (!windowContent.contains(event.target) && state.running && !state.paused) {
            pauseGame("Lost focus");
        }
    }

    function handleWindowMouseDown() {
        if (state.running && state.paused) {
            resumeGame();
        }
    }

    function handleWindowBlur() {
        if (state.running && !state.paused) {
            pauseGame("Lost focus");
        }
    }

    function cleanupGame() {
        if (state.animationFrame) {
            window.cancelAnimationFrame(state.animationFrame);
            state.animationFrame = null;
        }
        document.removeEventListener("keyup", handleKeyUp);
        document.removeEventListener("mousedown", handleDocumentMouseDown);
        newWin.removeEventListener("window-keydown", handleWindowKeyDown);
        window.removeEventListener("blur", handleWindowBlur);
        windowContent.removeEventListener("mousedown", handleWindowMouseDown);
    }

    startButton.addEventListener("click", () => {
        resetGame();
        if (!state.running) {
            state.running = true;
            state.paused = false;
        }
        startButton.textContent = "Restart";
    });

    pauseButton.addEventListener("click", () => {
        if (!state.running) return;
        if (state.paused) {
            resumeGame();
        } else {
            pauseGame("Pause manuelle");
        }
    });

    newWin.addEventListener("window-keydown", handleWindowKeyDown);
    newWin.addEventListener("window-keyup", handleKeyUp);
    document.addEventListener("mousedown", handleDocumentMouseDown);
    window.addEventListener("blur", handleWindowBlur);
    windowContent.addEventListener("mousedown", handleWindowMouseDown);

    updateHighScoreDisplay();
    draw();
}

export { invadersWindow };
