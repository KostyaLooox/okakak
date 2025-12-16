class HorrorPlatformer {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.screens = {
            warning: document.getElementById('warningScreen'),
            start: document.getElementById('startMenu'),
            controls: document.getElementById('controlsScreen'),
            game: document.getElementById('gameScreen'),
            death: document.getElementById('deathScreen'),
            win: document.getElementById('winScreen'),
            jumpscare: document.getElementById('jumpscareScreen')
        };
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.currentLevel = 1;
        this.gameState = 'warning';
        this.selectedCharacter = 'izumi';
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        this.camera = { x: 0, y: 0 };
        this.dialogueTimer = 0;
        this.currentDialogue = '';
        this.trapCooldown = 0;
        this.jumpscareCooldown = 0;
        this.deathCount = 0;
        
        // Размеры уровней
        this.levelBounds = {
            1: { width: 2000, height: 600 },
            2: { width: 2000, height: 600 },
            3: { width: 2000, height: 600 },
            4: { width: 2000, height: 600 }
        };
        
        this.levels = this.createLevels();
        this.resetGame();
    }

    createLevels() {
        return {
            1: this.createLevel1(),
            2: this.createLevel2(),
            3: this.createLevel3(),
            4: this.createLevel4()
        };
    }

    createLevel1() {
        return {
            platforms: [
                { x: 0, y: 550, width: 400, height: 50, type: 'normal', color: '#34495e' },
                { x: 500, y: 500, width: 200, height: 50, type: 'normal', color: '#34495e' },
                { x: 800, y: 450, width: 200, height: 50, type: 'normal', color: '#34495e' },
                { x: 1100, y: 400, width: 200, height: 50, type: 'normal', color: '#34495e' },
                { x: 1400, y: 550, width: 400, height: 50, type: 'normal', color: '#34495e' },
                { x: 1850, y: 500, width: 100, height: 50, type: 'normal', color: '#34495e' }
            ],
            enemies: [
                { 
                    x: 600, y: 450, width: 40, height: 50, 
                    health: 30, maxHealth: 30, speed: 1, 
                    type: 'shadow', direction: 1
                },
                { 
                    x: 1000, y: 400, width: 40, height: 50, 
                    health: 30, maxHealth: 30, speed: 1, 
                    type: 'shadow', direction: -1
                }
            ],
            traps: [
                { x: 450, y: 530, width: 30, height: 20, type: 'spike', active: true, damage: 20 },
                { x: 900, y: 430, width: 40, height: 20, type: 'spike', active: true, damage: 20 }
            ],
            jumpscares: [
                { x: 700, y: 300, width: 100, height: 100, triggered: false }
            ],
            dialogues: [
                { x: 300, text: "Где я?.. Все так знакомо, но искажено..." },
                { x: 900, text: "Эти тени... Они повсюду..." },
                { x: 1600, text: "Впереди выход... Но что ждет меня там?" }
            ],
            exit: { x: 1900, y: 450, width: 50, height: 50, color: '#27ae60' },
            background: '#1a1a2e'
        };
    }

    createLevel2() {
        return {
            platforms: [
                { x: 0, y: 550, width: 300, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 400, y: 450, width: 200, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 700, y: 350, width: 150, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 950, y: 450, width: 200, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 1250, y: 550, width: 300, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 1600, y: 450, width: 200, height: 50, type: 'normal', color: '#2c3e50' },
                { x: 1850, y: 400, width: 100, height: 50, type: 'normal', color: '#2c3e50' }
            ],
            enemies: [
                { 
                    x: 450, y: 400, width: 40, height: 50, 
                    health: 50, maxHealth: 50, speed: 1.5, 
                    type: 'phantom', direction: 1
                },
                { 
                    x: 800, y: 300, width: 40, height: 50, 
                    health: 50, maxHealth: 50, speed: 1.5, 
                    type: 'phantom', direction: -1
                },
                { 
                    x: 1100, y: 400, width: 40, height: 50, 
                    health: 50, maxHealth: 50, speed: 1.5, 
                    type: 'phantom', direction: 1
                }
            ],
            traps: [
                { x: 350, y: 530, width: 25, height: 20, type: 'spike', active: true, damage: 25 },
                { x: 850, y: 430, width: 30, height: 20, type: 'spike', active: true, damage: 25 },
                { x: 1350, y: 530, width: 35, height: 20, type: 'spike', active: true, damage: 25 }
            ],
            jumpscares: [
                { x: 600, y: 200, width: 100, height: 100, triggered: false },
                { x: 1200, y: 250, width: 100, height: 100, triggered: false }
            ],
            movingPlatforms: [
                { x: 650, y: 400, width: 80, height: 20, speed: 2, direction: 1, range: 200, startX: 650 }
            ],
            dialogues: [
                { x: 500, text: "Этот мир... он реагирует на мои мысли..." },
                { x: 1200, text: "Doki... я чувствую ее присутствие..." },
                { x: 1700, text: "Становится все опаснее..." }
            ],
            exit: { x: 1900, y: 350, width: 50, height: 50, color: '#27ae60' },
            background: '#16213e'
        };
    }

    createLevel3() {
        return {
            platforms: [
                { x: 0, y: 550, width: 200, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 300, y: 450, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 500, y: 350, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 700, y: 450, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 900, y: 550, width: 200, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 1200, y: 450, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 1400, y: 350, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 1600, y: 450, width: 100, height: 50, type: 'normal', color: '#8e44ad' },
                { x: 1850, y: 400, width: 100, height: 50, type: 'normal', color: '#8e44ad' }
            ],
            pressurePlates: [
                { x: 250, y: 500, width: 30, height: 10, activated: false, doorId: 0, color: '#e74c3c' },
                { x: 650, y: 400, width: 30, height: 10, activated: false, doorId: 1, color: '#e74c3c' },
                { x: 1150, y: 400, width: 30, height: 10, activated: false, doorId: 2, color: '#e74c3c' }
            ],
            doors: [
                { x: 400, y: 300, width: 50, height: 150, open: false, color: '#9b59b6' },
                { x: 800, y: 300, width: 50, height: 150, open: false, color: '#9b59b6' },
                { x: 1300, y: 300, width: 50, height: 150, open: false, color: '#9b59b6' }
            ],
            traps: [
                { x: 200, y: 530, width: 20, height: 20, type: 'spike', active: true, damage: 30 },
                { x: 600, y: 430, width: 25, height: 20, type: 'spike', active: true, damage: 30 },
                { x: 1000, y: 530, width: 30, height: 20, type: 'spike', active: true, damage: 30 },
                { x: 1400, y: 430, width: 25, height: 20, type: 'spike', active: true, damage: 30 }
            ],
            jumpscares: [
                { x: 400, y: 200, width: 100, height: 100, triggered: false },
                { x: 900, y: 150, width: 100, height: 100, triggered: false },
                { x: 1500, y: 200, width: 100, height: 100, triggered: false }
            ],
            movingPlatforms: [
                { x: 550, y: 300, width: 70, height: 20, speed: 2.5, direction: 1, range: 180, startX: 550 },
                { x: 1300, y: 270, width: 70, height: 20, speed: 2, direction: -1, range: 200, startX: 1300 }
            ],
            enemies: [],
            dialogues: [
                { x: 200, text: "Лабиринт моего разума... Каждая дверь - воспоминание." },
                { x: 1000, text: "Нужно найти все плиты... но что откроется в конце?" },
                { x: 1700, text: "Почему Doki сделала это с нами?" }
            ],
            exit: { x: 1900, y: 350, width: 50, height: 50, color: '#27ae60' },
            background: '#0f3460'
        };
    }

    createLevel4() {
        return {
            platforms: [
                { x: 0, y: 550, width: 1200, height: 50, type: 'normal', color: '#c0392b' },
                { x: 1300, y: 550, width: 700, height: 50, type: 'normal', color: '#c0392b' }
            ],
            enemies: [], // Добавляем пустой массив врагов
            boss: {
                x: 1000, y: 300, width: 60, height: 90,
                health: 300, maxHealth: 300,
                phase: 1, attackCooldown: 0,
                speed: 2, direction: 1,
                type: 'doki',
                isBoss: true // Добавляем флаг босса
            },
            traps: [
                { x: 300, y: 530, width: 40, height: 20, type: 'spike', active: true, damage: 40 },
                { x: 600, y: 530, width: 40, height: 20, type: 'spike', active: true, damage: 40 },
                { x: 1100, y: 530, width: 40, height: 20, type: 'spike', active: true, damage: 40 },
                { x: 1500, y: 530, width: 40, height: 20, type: 'spike', active: true, damage: 40 }
            ],
            jumpscares: [
                { x: 500, y: 200, width: 100, height: 100, triggered: false },
                { x: 1200, y: 150, width: 100, height: 100, triggered: false }
            ],
            movingPlatforms: [
                { x: 700, y: 400, width: 80, height: 20, speed: 3, direction: 1, range: 300, startX: 700 }
            ],
            dialogues: [
                { x: 400, text: "DOKI! Прекрати это! Мы же друзья!" },
                { x: 900, text: "Твое сознание искажено... Я должен освободить тебя!" },
                { x: 1600, text: "Прости меня за то, что я должен сделать..." }
            ],
            exit: null,
            background: '#2d0320'
        };
    }

    setupEventListeners() {
        // Предупреждение
        document.getElementById('acceptWarning').addEventListener('click', () => {
            this.showScreen('start');
        });

        // Выбор персонажа
        document.querySelectorAll('.character').forEach(char => {
            char.addEventListener('click', () => {
                document.querySelectorAll('.character').forEach(c => {
                    c.classList.remove('selected');
                });
                char.classList.add('selected');
                this.selectedCharacter = char.dataset.char;
                document.getElementById('characterName').textContent = this.selectedCharacter.toUpperCase();
            });
        });

        // Кнопки меню
        document.getElementById('startButton').addEventListener('click', () => {
            this.showScreen('game');
            this.gameState = 'playing';
            this.resetGame();
            this.gameLoop();
        });

        document.getElementById('controlsButton').addEventListener('click', () => {
            this.showScreen('controls');
        });

        document.getElementById('backButton').addEventListener('click', () => {
            this.showScreen('start');
        });

        document.getElementById('respawnButton').addEventListener('click', () => {
            this.resetGame();
            this.showScreen('game');
            this.gameState = 'playing';
            this.gameLoop();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.deathCount = 0;
            this.resetGame();
            this.showScreen('start');
        });

        // Управление клавиатурой
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.keys[e.key.toLowerCase()] = true;
                
                if (e.key === 'Escape') {
                    this.showScreen('start');
                    this.gameState = 'menu';
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.gameState === 'playing') {
                this.keys[e.key.toLowerCase()] = false;
            }
        });

        // Управление мышью
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            if (this.gameState === 'playing') {
                this.shoot();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
        this.screens[screenName].classList.remove('hidden');
    }

    resetGame() {
        this.player = {
            x: 100,
            y: 400,
            width: 40,
            height: 60,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpForce: 12,
            isGrounded: false,
            health: 100,
            maxHealth: 100,
            facing: 1,
            attackCooldown: 0,
            bullets: [],
            character: this.selectedCharacter
        };

        this.currentLevel = 1;
        this.loadLevel(this.currentLevel);
    }

    loadLevel(level) {
        this.levelData = JSON.parse(JSON.stringify(this.levels[level]));
        this.player.x = 100;
        this.player.y = 400;
        this.camera.x = 0;
        this.camera.y = 0;
        this.dialogueTimer = 0;
        this.currentDialogue = '';
        
        // Инициализируем все массивы, если они undefined
        if (!this.levelData.enemies) this.levelData.enemies = [];
        if (!this.levelData.traps) this.levelData.traps = [];
        if (!this.levelData.jumpscares) this.levelData.jumpscares = [];
        if (!this.levelData.movingPlatforms) this.levelData.movingPlatforms = [];
        if (!this.levelData.pressurePlates) this.levelData.pressurePlates = [];
        if (!this.levelData.doors) this.levelData.doors = [];
        if (!this.levelData.dialogues) this.levelData.dialogues = [];
        
        document.getElementById('levelInfo').textContent = 
            `Уровень ${level}: ${this.getLevelName(level)}`;
        
        if (level === 4) {
            document.getElementById('bossHealth').classList.remove('hidden');
        } else {
            document.getElementById('bossHealth').classList.add('hidden');
        }
        
        this.updateHealthDisplay();
        document.getElementById('deathCount').textContent = this.deathCount;
    }

    getLevelName(level) {
        const names = {
            1: 'Пробуждение',
            2: 'Эхо прошлого',
            3: 'Лабиринт разума',
            4: 'Искаженная реальность'
        };
        return names[level] || `Уровень ${level}`;
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.handleInput();
        this.updatePhysics();
        this.updateCamera();
        this.updateEnemies();
        this.updateBullets();
        this.updateTraps();
        this.updateJumpscares();
        this.updateMovingPlatforms();
        this.updatePressurePlates();
        this.updateDialogues();
        this.checkCollisions();
        this.checkLevelCompletion();
        
        if (this.player.attackCooldown > 0) {
            this.player.attackCooldown--;
        }

        if (this.trapCooldown > 0) {
            this.trapCooldown--;
        }

        if (this.jumpscareCooldown > 0) {
            this.jumpscareCooldown--;
        }

        if (this.dialogueTimer > 0) {
            this.dialogueTimer--;
            if (this.dialogueTimer === 0) {
                document.getElementById('dialogue').classList.add('hidden');
            }
        }
    }

    handleInput() {
        this.player.velocityX = 0;
        
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.velocityX = -this.player.speed;
            this.player.facing = -1;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.player.velocityX = this.player.speed;
            this.player.facing = 1;
        }

        if ((this.keys['w'] || this.keys['arrowup'] || this.keys[' ']) && this.player.isGrounded) {
            this.player.velocityY = -this.player.jumpForce;
            this.player.isGrounded = false;
        }
    }

    updatePhysics() {
        // Гравитация
        this.player.velocityY += 0.5;
        
        // Ограничение скорости падения
        if (this.player.velocityY > 15) {
            this.player.velocityY = 15;
        }

        // Обновление позиции
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // Проверка границ уровня по X
        const levelWidth = this.levelBounds[this.currentLevel].width;
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > levelWidth - this.player.width) {
            this.player.x = levelWidth - this.player.width;
        }

        // Падение за нижнюю границу
        if (this.player.y > this.canvas.height) {
            this.player.health = 0;
        }
    }

    updateCamera() {
        // Центрируем камеру на игроке
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;
        
        // Ограничиваем камеру границами уровня
        const levelWidth = this.levelBounds[this.currentLevel].width;
        const levelHeight = this.levelBounds[this.currentLevel].height;
        
        // По X
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.x > levelWidth - this.canvas.width) {
            this.camera.x = levelWidth - this.canvas.width;
        }
        
        // По Y
        if (this.camera.y < 0) this.camera.y = 0;
        if (this.camera.y > levelHeight - this.canvas.height) {
            this.camera.y = levelHeight - this.canvas.height;
        }
    }

    updateEnemies() {
        // Обновляем обычных врагов
        if (this.levelData.enemies) {
            this.levelData.enemies.forEach(enemy => {
                // Простое движение
                enemy.x += enemy.speed * enemy.direction;
                
                // Проверка для разворота у краев платформ
                let onPlatform = false;
                this.levelData.platforms.forEach(platform => {
                    if (this.checkCollision(
                        { x: enemy.x + enemy.speed, y: enemy.y + 1, width: enemy.width, height: enemy.height },
                        platform
                    )) {
                        onPlatform = true;
                    }
                });
                
                if (!onPlatform) {
                    enemy.direction *= -1;
                }

                // Столкновение с игроком
                if (this.checkCollision(this.player, enemy)) {
                    this.player.health -= 0.5;
                    this.updateHealthDisplay();
                }
            });
        }

        // Обновление босса
        if (this.levelData.boss) {
            this.updateBoss();
        }
    }

    updateBoss() {
        const boss = this.levelData.boss;
        
        // Движение босса
        boss.x += boss.speed * boss.direction;
        
        // Ограничиваем движение босса в пределах арены
        if (boss.x < 800 || boss.x > 1200) {
            boss.direction *= -1;
        }

        // Атака босса
        if (boss.attackCooldown <= 0) {
            this.bossAttack();
            boss.attackCooldown = 90; // Уменьшил кулдаун для более частых атак
        } else {
            boss.attackCooldown--;
        }

        // Обновление здоровья босса
        const healthPercent = (boss.health / boss.maxHealth) * 100;
        document.getElementById('bossHealthFill').style.width = healthPercent + '%';

        // Проверка смерти босса
        if (boss.health <= 0) {
            document.getElementById('totalDeaths').textContent = this.deathCount;
            this.showScreen('win');
            this.gameState = 'win';
        }
    }

    bossAttack() {
        const boss = this.levelData.boss;
        
        // Создаем снаряд босса
        const projectile = {
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height / 2,
            width: 15,
            height: 15,
            velocityX: 0,
            velocityY: 0,
            type: 'bossProjectile',
            damage: 20,
            color: '#ff0000'
        };

        // Направляем снаряд в игрока
        const dx = this.player.x - projectile.x;
        const dy = this.player.y - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            projectile.velocityX = (dx / distance) * 5;
            projectile.velocityY = (dy / distance) * 5;
        }

        // Добавляем снаряд в массив врагов
        if (!this.levelData.enemies) this.levelData.enemies = [];
        this.levelData.enemies.push(projectile);
    }

    updateBullets() {
        // Пули игрока
        this.player.bullets = this.player.bullets.filter(bullet => {
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;

            // Столкновения с обычными врагами
            if (this.levelData.enemies) {
                this.levelData.enemies.forEach((enemy, enemyIndex) => {
                    if (this.checkCollision(bullet, enemy)) {
                        enemy.health -= 10;
                        if (enemy.health <= 0) {
                            this.levelData.enemies.splice(enemyIndex, 1);
                        }
                        return false;
                    }
                });
            }

            // Столкновение с боссом
            if (this.levelData.boss && this.checkCollision(bullet, this.levelData.boss)) {
                this.levelData.boss.health -= 10;
                return false;
            }

            // Удаление за пределами уровня
            const levelWidth = this.levelBounds[this.currentLevel].width;
            if (bullet.x < 0 || bullet.x > levelWidth || bullet.y < 0 || bullet.y > this.canvas.height) {
                return false;
            }

            return true;
        });

        // Снаряды врагов (включая босса)
        if (this.levelData.enemies) {
            for (let i = this.levelData.enemies.length - 1; i >= 0; i--) {
                const enemy = this.levelData.enemies[i];
                
                if (enemy.type === 'bossProjectile') {
                    enemy.x += enemy.velocityX;
                    enemy.y += enemy.velocityY;

                    if (this.checkCollision(this.player, enemy)) {
                        this.player.health -= enemy.damage;
                        this.updateHealthDisplay();
                        this.levelData.enemies.splice(i, 1);
                        continue;
                    }

                    // Удаление за пределами
                    const levelWidth = this.levelBounds[this.currentLevel].width;
                    if (enemy.x < 0 || enemy.x > levelWidth || enemy.y < 0 || enemy.y > this.canvas.height) {
                        this.levelData.enemies.splice(i, 1);
                    }
                }
            }
        }
    }

    updateTraps() {
        if (!this.levelData.traps) return;

        this.levelData.traps.forEach(trap => {
            if (trap.active && this.checkCollision(this.player, trap) && this.trapCooldown === 0) {
                this.player.health -= trap.damage;
                this.updateHealthDisplay();
                this.trapCooldown = 60;
                
                // Эффект тряски
                this.canvas.classList.add('shake');
                setTimeout(() => this.canvas.classList.remove('shake'), 500);
            }
        });
    }

    updateJumpscares() {
        if (!this.levelData.jumpscares || this.jumpscareCooldown > 0) return;

        this.levelData.jumpscares.forEach(jumpscare => {
            if (!jumpscare.triggered && this.checkCollision(this.player, jumpscare)) {
                this.triggerJumpscare();
                jumpscare.triggered = true;
                this.jumpscareCooldown = 300;
            }
        });
    }

    triggerJumpscare() {
        this.screens.jumpscare.classList.remove('hidden');
        
        setTimeout(() => {
            this.screens.jumpscare.classList.add('hidden');
        }, 800);
    }

    updateMovingPlatforms() {
        if (!this.levelData.movingPlatforms) return;

        this.levelData.movingPlatforms.forEach(platform => {
            platform.x += platform.speed * platform.direction;
            
            if (platform.direction > 0 && platform.x > platform.startX + platform.range) {
                platform.direction = -1;
            } else if (platform.direction < 0 && platform.x < platform.startX) {
                platform.direction = 1;
            }

            // Столкновение игрока с платформой
            if (this.checkCollision(this.player, platform)) {
                this.player.x += platform.speed * platform.direction;
                if (this.player.velocityY > 0 && this.player.y < platform.y) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isGrounded = true;
                }
            }
        });
    }

    updatePressurePlates() {
        if (!this.levelData.pressurePlates) return;

        this.levelData.pressurePlates.forEach(plate => {
            const wasActivated = plate.activated;
            plate.activated = this.checkCollision(this.player, plate);

            if (plate.activated && !wasActivated && this.levelData.doors) {
                this.levelData.doors[plate.doorId].open = true;
            }
        });
    }

    updateDialogues() {
        if (!this.levelData.dialogues) return;

        if (this.dialogueTimer === 0) {
            this.levelData.dialogues.forEach(dialogue => {
                if (Math.abs(this.player.x - dialogue.x) < 50) {
                    this.showDialogue(dialogue.text);
                }
            });
        }
    }

    showDialogue(text) {
        this.currentDialogue = text;
        this.dialogueTimer = 180;
        const dialogueElement = document.getElementById('dialogue');
        dialogueElement.textContent = text;
        dialogueElement.classList.remove('hidden');
    }

    shoot() {
        if (this.player.attackCooldown > 0) return;

        const bullet = {
            x: this.player.x + this.player.width / 2,
            y: this.player.y + this.player.height / 2,
            width: 8,
            height: 8,
            velocityX: this.player.facing * 8,
            velocityY: 0,
            color: this.selectedCharacter === 'izumi' ? '#4a90e2' : '#e84393'
        };

        this.player.bullets.push(bullet);
        this.player.attackCooldown = 15;
    }

    checkCollisions() {
        this.player.isGrounded = false;

        // Проверка всех платформ
        const allPlatforms = [
            ...this.levelData.platforms,
            ...(this.levelData.movingPlatforms || [])
        ];

        allPlatforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                // Определяем сторону столкновения
                const playerBottom = this.player.y + this.player.height;
                const playerRight = this.player.x + this.player.width;
                const platformBottom = platform.y + platform.height;
                const platformRight = platform.x + platform.width;

                // Определяем глубину проникновения с каждой стороны
                const bottomOverlap = playerBottom - platform.y;
                const topOverlap = platformBottom - this.player.y;
                const rightOverlap = playerRight - platform.x;
                const leftOverlap = platformRight - this.player.x;

                // Находим минимальное перекрытие
                const minOverlap = Math.min(bottomOverlap, topOverlap, rightOverlap, leftOverlap);

                // Разрешаем столкновение в зависимости от стороны
                if (minOverlap === bottomOverlap) {
                    // Столкновение сверху платформы
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isGrounded = true;
                } else if (minOverlap === topOverlap) {
                    // Столкновение снизу платформы
                    this.player.y = platformBottom;
                    this.player.velocityY = 0;
                } else if (minOverlap === rightOverlap) {
                    // Столкновение слева платформы
                    this.player.x = platform.x - this.player.width;
                    this.player.velocityX = 0;
                } else if (minOverlap === leftOverlap) {
                    // Столкновение справа платформы
                    this.player.x = platformRight;
                    this.player.velocityX = 0;
                }
            }
        });

        // Проверка здоровья
        if (this.player.health <= 0) {
            this.deathCount++;
            this.showScreen('death');
            this.gameState = 'dead';
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkLevelCompletion() {
        if (this.levelData.exit && this.checkCollision(this.player, this.levelData.exit)) {
            this.currentLevel++;
            if (this.currentLevel <= 4) {
                this.loadLevel(this.currentLevel);
            } else {
                document.getElementById('totalDeaths').textContent = this.deathCount;
                this.showScreen('win');
                this.gameState = 'win';
            }
        }
    }

    updateHealthDisplay() {
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('playerHealth').style.width = healthPercent + '%';
    }

    render() {
        // Очистка
        this.ctx.fillStyle = this.levelData.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Отрисовка платформ
        this.levelData.platforms.forEach(platform => {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Отрисовка ловушек
        if (this.levelData.traps && this.levelData.traps.forEach) {
            this.levelData.traps.forEach(trap => {
                this.ctx.fillStyle = trap.active ? '#ff0000' : '#660000';
                this.ctx.fillRect(trap.x, trap.y, trap.width, trap.height);
            });
        }

        // Отрисовка движущихся платформ
        if (this.levelData.movingPlatforms && this.levelData.movingPlatforms.forEach) {
            this.levelData.movingPlatforms.forEach(platform => {
                this.ctx.fillStyle = '#e67e22';
                this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });
        }

        // Отрисовка нажимных плит
        if (this.levelData.pressurePlates && this.levelData.pressurePlates.forEach) {
            this.levelData.pressurePlates.forEach(plate => {
                this.ctx.fillStyle = plate.activated ? '#27ae60' : plate.color;
                this.ctx.fillRect(plate.x, plate.y, plate.width, plate.height);
            });
        }

        // Отрисовка дверей
        if (this.levelData.doors && this.levelData.doors.forEach) {
            this.levelData.doors.forEach(door => {
                if (!door.open) {
                    this.ctx.fillStyle = door.color;
                    this.ctx.fillRect(door.x, door.y, door.width, door.height);
                }
            });
        }

        // Отрисовка выхода
        if (this.levelData.exit) {
            this.ctx.fillStyle = this.levelData.exit.color;
            this.ctx.fillRect(this.levelData.exit.x, this.levelData.exit.y, 
                            this.levelData.exit.width, this.levelData.exit.height);
        }

        // Отрисовка врагов
        if (this.levelData.enemies && this.levelData.enemies.forEach) {
            this.levelData.enemies.forEach(enemy => {
                if (enemy.type === 'bossProjectile') {
                    this.ctx.fillStyle = enemy.color || '#ff00ff';
                    this.ctx.beginPath();
                    this.ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    this.ctx.fillStyle = enemy.type === 'shadow' ? '#2c3e50' : '#8e44ad';
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    // Полоска здоровья для обычных врагов
                    if (enemy.maxHealth) {
                        const healthPercent = (enemy.health / enemy.maxHealth) * 100;
                        this.ctx.fillStyle = '#333';
                        this.ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
                        this.ctx.fillStyle = '#e74c3c';
                        this.ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * (healthPercent / 100), 5);
                    }
                }
            });
        }

        // Отрисовка босса
        if (this.levelData.boss) {
            this.ctx.fillStyle = this.selectedCharacter === 'izumi' ? '#e84393' : '#4a90e2';
            this.ctx.fillRect(this.levelData.boss.x, this.levelData.boss.y, 
                            this.levelData.boss.width, this.levelData.boss.height);
            
            // Эффект вокруг босса
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.levelData.boss.x + this.levelData.boss.width/2, 
                        this.levelData.boss.y + this.levelData.boss.height/2, 
                        this.levelData.boss.width + 20, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Отрисовка игрока
        this.ctx.fillStyle = this.selectedCharacter === 'izumi' ? '#4a90e2' : '#e84393';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Индикатор направления взгляда
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(this.player.x + (this.player.facing > 0 ? this.player.width : -5), 
                         this.player.y + this.player.height/2 - 2.5, 5, 5);
        
        // Отрисовка пуль игрока
        this.player.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.width/2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.restore();

        // Отрисовка прицела (в координатах экрана, не уровня)
        if (this.gameState === 'playing') {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouse.x - 8, this.mouse.y);
            this.ctx.lineTo(this.mouse.x + 8, this.mouse.y);
            this.ctx.moveTo(this.mouse.x, this.mouse.y - 8);
            this.ctx.lineTo(this.mouse.x, this.mouse.y + 8);
            this.ctx.stroke();
        }
    }
}

// Запуск игры
window.addEventListener('load', () => {
    new HorrorPlatformer();
});