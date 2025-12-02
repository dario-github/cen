        // --- Game Class ---
        class Game {
            constructor() {
                this.state = this.loadState();
                this.audioCtx = null;
                this.initUI();
                this.initVoice();
                this.renderShop();
                this.renderDex();
                this.updateWelcome();
                this.applyTheme(this.state.equippedTheme);
                this.applyAvatar(this.state.equippedAvatar);

                // Preload images
                Object.values(THEMES).forEach(t => {
                    const img = new Image();
                    img.src = t.bg;
                });

                if (!this.state.hasStarterBonus) {
                    this.state.coins += 500;
                    this.state.hasStarterBonus = true;
                    this.saveState();
                    this.showToast("🎁 新手礼包: +500金币!");
                }
            }

            loadState() {
                const defaultState = {
                    xp: 0,
                    level: 1,
                    coins: 0,
                    unlockedMonsters: [],
                    inventory: ['w_fist', 't_dark', 'a_casual'],
                    equippedWeapon: 'w_fist',
                    equippedTheme: 't_dark',
                    equippedAvatar: 'a_casual',
                    hasStarterBonus: false,
                    history: []
                };
                try {
                    const savedState = JSON.parse(localStorage.getItem('rpg_state')) || defaultState;
                    // Merge with default state to ensure new properties are added
                    return { ...defaultState, ...savedState };
                } catch (e) {
                    return defaultState;
                }
            }

            saveState() {
                localStorage.setItem('rpg_state', JSON.stringify(this.state));
                this.updateUI();
            }

            exportSave() {
                const code = btoa(JSON.stringify(this.state));
                navigator.clipboard.writeText(code).then(() => {
                    this.showToast("✅ 存档码已复制到剪贴板");
                });
            }

            importSave() {
                // Use setTimeout to ensure UI is ready and prevent immediate closing issues
                setTimeout(() => {
                    const code = prompt("请输入存档码:");
                    if (code) {
                        try {
                            const importedState = JSON.parse(atob(code));
                            // Validate imported state structure if necessary
                            this.state = { ...this.loadState(), ...importedState }; // Merge to ensure all properties exist
                            this.saveState();
                            this.renderShop();
                            this.renderDex();
                            this.applyTheme(this.state.equippedTheme);
                            this.applyAvatar(this.state.equippedAvatar);
                            this.showToast("✅ 读取成功!");
                        } catch (e) {
                            console.error(e);
                            this.showToast("❌ 存档码无效");
                        }
                    }
                }, 100);
            }

            initUI() {
                this.updateUI();
                document.body.addEventListener('click', () => this.initAudio(), { once: true });
            }

            updateWelcome() {
                const hour = new Date().getHours();
                let msg = "";
                if (hour < 12) msg = "早安，阿涔☀️ 又是元气满满的一天！";
                else if (hour < 18) msg = "下午好，阿涔☕️ 累了就来这里歇歇吧。";
                else msg = "晚上好，阿涔🌙 无论多晚，我都陪着你。";
                document.getElementById('welcomeText').innerText = msg;
            }

            initVoice() {
                const btn = document.getElementById('voiceBtn');
                const input = document.getElementById('moodInput');

                if ('webkitSpeechRecognition' in window) {
                    const recognition = new webkitSpeechRecognition();
                    recognition.lang = 'zh-CN';
                    recognition.onstart = () => btn.classList.add('listening');
                    recognition.onend = () => btn.classList.remove('listening');
                    recognition.onresult = (e) => {
                        input.value += e.results[0][0].transcript;
                        this.playSound('coin');
                    };
                    btn.onclick = () => {
                        this.initAudio();
                        recognition.start();
                    };
                } else {
                    btn.style.display = 'none';
                }
            }

            initAudio() {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            }

            playSound(type) {
                if (!this.audioCtx) return;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                const now = this.audioCtx.currentTime;

                if (type === 'coin') {
                    osc.frequency.setValueAtTime(1200, now);
                    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === 'smash') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
                    gain.gain.setValueAtTime(0.5, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);

                    const osc2 = this.audioCtx.createOscillator();
                    const gain2 = this.audioCtx.createGain();
                    osc2.connect(gain2);
                    gain2.connect(this.audioCtx.destination);
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1200, now);
                    osc2.frequency.linearRampToValueAtTime(2000, now + 0.1);
                    gain2.gain.setValueAtTime(0.2, now);
                    gain2.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc2.start(now);
                    osc2.stop(now + 0.1);

                } else if (type === 'levelup') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
                    osc.frequency.linearRampToValueAtTime(800, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.6);
                    osc.start(now);
                    osc.stop(now + 0.6);
                }
            }

            updateUI() {
                document.getElementById('levelVal').innerText = this.state.level;
                document.getElementById('coinVal').innerText = this.state.coins;

                const currentLevelXP = LEVELS[this.state.level - 1];
                const nextLevelXP = LEVELS[this.state.level] || (currentLevelXP + 1000);
                const progress = ((this.state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
                document.getElementById('xpBar').style.width = `${Math.min(100, Math.max(0, progress))}%`;
                document.getElementById('dexCount').innerText = this.state.unlockedMonsters.length;
            }

            identifyMonster(text) {
                for (const key in MONSTERS) {
                    if (key === 'unknown') continue;
                    if (MONSTERS[key].keywords.some(k => text.includes(k))) {
                        return MONSTERS[key];
                    }
                }
                return MONSTERS.unknown;
            }

            crush() {
                const input = document.getElementById('moodInput');
                const text = input.value.trim();
                if (!text) {
                    this.showToast('⚠️ 阿涔小迷糊，要先写下来哦！');
                    return;
                }

                const monster = this.identifyMonster(text);
                if (!this.state.unlockedMonsters.includes(monster.id)) {
                    this.state.unlockedMonsters.push(monster.id);
                    this.showToast(`🆕 解锁新图鉴: ${monster.name}!`);
                    this.renderDex();
                }

                const xpGain = 50 + Math.floor(text.length * 2);
                const coinGain = 50 + Math.floor(Math.random() * 50);

                this.gainRewards(xpGain, coinGain);
                this.playAnimation(text, monster);
                this.addToHistory(text); // Add to history after crushing

                input.value = '';
                this.saveState();
                this.updateUI(); // Ensure UI updates immediately
            }

            gainRewards(xp, coins) {
                this.state.xp += xp;
                this.state.coins += coins;

                const nextLevelXP = LEVELS[this.state.level];
                if (nextLevelXP && this.state.xp >= nextLevelXP) {
                    this.state.level++;
                    this.showToast(`🆙 阿涔升级啦！Lv.${this.state.level}`);
                    this.playSound('levelup');
                } else {
                    this.showToast(`✨ +${coins}金币  +${xp}经验`);
                }
            }

            playAnimation(text, monster) {
                const container = document.getElementById('monsterContainer');
                const mText = document.getElementById('monsterText');
                const flash = document.getElementById('flashOverlay');
                const inputCardRect = document.getElementById('inputCard').getBoundingClientRect();

                mText.innerText = text;
                // 1. Appear
                container.style.transform = 'translate(-50%, -50%) scale(1)';
                container.style.opacity = '1';

                // 2. Shake (Wait a bit for user to see it)
                setTimeout(() => {
                    container.style.animation = 'shake-hard 0.8s infinite'; // Slower shake
                }, 300);

                // 3. Crush/Explode
                setTimeout(() => {
                    this.playSound('smash');
                    if (navigator.vibrate) navigator.vibrate([50, 50, 200]);

                    document.body.style.animation = 'shake-hard 0.5s';
                    flash.style.opacity = '0.8';
                    setTimeout(() => flash.style.opacity = '0', 300); // Slower flash fade

                    this.createParticles(inputCardRect.left + inputCardRect.width / 2, inputCardRect.top + inputCardRect.height / 2);

                    container.style.animation = '';
                    container.style.transform = 'translate(-50%, -50%) scale(2)';
                    container.style.opacity = '0';
                    container.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out'; // Smooth exit

                    setTimeout(() => {
                        // Reset for next time
                        container.style.transition = 'none';
                        container.style.transform = 'translate(-50%, -50%) scale(0)';
                        container.style.opacity = '1';
                        document.body.style.animation = '';

                        // Update UI after animation to ensure user sees the effect first
                        this.updateUI();
                    }, 500);
                }, 1500); // Longer wait before crush (1.5s)
            }

            createParticles(x, y) {
                const colors = ['#ff9a9e', '#fad0c4', '#a18cd1', '#ffffff', '#ffd700', '#ff6b6b'];
                const particleCount = 150;

                for (let i = 0; i < particleCount; i++) {
                    const p = document.createElement('div');
                    p.classList.add('particle');
                    document.body.appendChild(p);

                    const size = Math.random() * 10 + 5;
                    p.style.width = `${size}px`;
                    p.style.height = `${size}px`;
                    p.style.background = colors[Math.floor(Math.random() * colors.length)];
                    p.style.left = `${x}px`;
                    p.style.top = `${y}px`;
                    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 300 + 100;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity;

                    p.animate([
                        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
                        { transform: `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                    ], {
                        duration: 800 + Math.random() * 400,
                        easing: 'cubic-bezier(0, .9, .57, 1)',
                        fill: 'forwards'
                    }).onfinish = () => p.remove();
                }
            }

            renderShop() {
                const container = document.getElementById('shopContent');
                container.innerHTML = '';

                const weapons = SHOP_ITEMS.filter(i => i.type === 'weapon');
                const themes = SHOP_ITEMS.filter(i => i.type === 'theme');
                const avatars = SHOP_ITEMS.filter(i => i.type === 'avatar');

                const createSection = (title, items) => {
                    const section = document.createElement('div');
                    section.style.marginBottom = '20px';
                    section.innerHTML = `<h3 style="margin: 10px 0 10px 0; color: var(--gold); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">${title}</h3>`;

                    const grid = document.createElement('div');
                    grid.className = 'shop-grid';

                    items.forEach(item => {
                        const owned = this.state.inventory.includes(item.id);
                        const isEquipped = (item.type === 'theme' && this.state.equippedTheme === item.id) ||
                            (item.type === 'weapon' && this.state.equippedWeapon === item.id) ||
                            (item.type === 'avatar' && this.state.equippedAvatar === item.id);

                        const el = document.createElement('div');
                        el.className = `shop-item ${owned ? 'owned' : ''}`;

                        // Image with fallback to icon
                        const imgHtml = `<img src="${item.image}" alt="${item.name}" class="shop-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">`;
                        const iconHtml = `<div class="shop-icon-fallback" style="display:none; font-size: 30px;">${item.icon}</div>`;

                        el.innerHTML = `
                            <div class="shop-img-wrapper">
                                ${imgHtml}
                                ${iconHtml}
                            </div>
                            <h4>${item.name}</h4>
                            <div class="shop-actions">
                                <button class="preview-btn" onclick="game.previewShopItem('${item.id}')">👀</button>
                                <button class="buy-btn" ${!owned && this.state.coins < item.price ? 'disabled' : ''}
                                    onclick="game.handleShopItem('${item.id}')">
                                    ${owned ? (isEquipped ? '✅ 已装备' : '装备') : '💰 ' + item.price}
                                </button>
                            </div>
                        `;
                        // Add visual border for equipped items
                        if (isEquipped) {
                            el.style.border = '2px solid var(--gold)';
                            el.style.boxShadow = '0 0 15px var(--gold)';
                        }
                        grid.appendChild(el);
                    });

                    section.appendChild(grid);
                    container.appendChild(section);
                };

                createSection('👗 阿涔的衣橱', avatars);
                createSection('💥 解压神器', weapons);
                createSection('🎨 专属主题', themes);
            }

            previewShopItem(id) {
                const item = SHOP_ITEMS.find(i => i.id === id);
                if (!item) return;

                if (item.type === 'avatar') {
                    // Preview Avatar: Temporarily apply filter
                    const originalFilter = document.getElementById('playerAvatar').style.filter;
                    this.applyAvatar(id); // Apply new look
                    this.showToast(`👀 试穿中: ${item.name}`);

                    // Revert after 3 seconds
                    setTimeout(() => {
                        if (this.state.equippedAvatar !== id) { // Only revert if not equipped during preview
                            this.applyAvatar(this.state.equippedAvatar);
                        }
                    }, 3000);
                } else if (item.type === 'theme') {
                     // Preview Theme
                     const originalTheme = this.state.equippedTheme;
                     this.applyTheme(id);
                     this.showToast(`👀 预览主题: ${item.name}`);
                     setTimeout(() => {
                         if (this.state.equippedTheme !== id) {
                             this.applyTheme(originalTheme);
                         }
                     }, 3000);
                } else {
                    // Preview Weapon: Just show toast for now as we don't have a weapon visual on main screen yet
                    this.showToast(`👀 预览武器: ${item.name}`);
                }
            }

            handleShopItem(id) {
                console.log("Handling shop item:", id);
                const item = SHOP_ITEMS.find(i => i.id === id);
                if (!item) {
                    console.error("Item not found:", id);
                    return;
                }

                // Purchase Logic
                if (!this.state.inventory.includes(id)) {
                    if (this.state.coins >= item.price) {
                        this.state.coins -= item.price;
                        this.state.inventory.push(id);
                        this.saveState();
                        this.showToast(`🛍️ 购买成功: ${item.name}`);
                        // Auto-equip after purchase
                        this.equipItem(item);
                    } else {
                        this.showToast(`💸 金币不足，还差 ${item.price - this.state.coins} 金币`);
                        return;
                    }
                } else {
                    // Already owned, just equip
                    this.equipItem(item);
                }

                this.renderShop(); // Re-render to update UI
            }

            equipItem(item) {
                if (item.type === 'theme') {
                    this.state.equippedTheme = item.id;
                    this.applyTheme(item.id);
                } else if (item.type === 'avatar') {
                    this.state.equippedAvatar = item.id;
                    this.applyAvatar(item.id);
                } else {
                    this.state.equippedWeapon = item.id;
                }
                this.saveState();
                this.showToast(`🎒 已装备: ${item.name}`);
            }

            applyTheme(themeId) {
                const theme = THEMES[themeId];
                if (theme) {
                    const root = document.documentElement;
                    root.style.setProperty('--primary', theme.primary);
                    root.style.setProperty('--secondary', theme.secondary);
                    document.body.style.backgroundImage = `url('${theme.bg}')`;
                }
            }

            applyAvatar(avatarId) {
                const item = SHOP_ITEMS.find(i => i.id === avatarId);
                if (item && item.filter) {
                    document.getElementById('playerAvatar').style.filter = item.filter;
                }
            }

            toggleHistory() {
                const modal = document.getElementById('historyModal');
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                } else {
                    this.renderHistory();
                    modal.style.display = 'flex';
                }
            }

            renderHistory() {
                const list = document.getElementById('historyList');
                list.innerHTML = '';
                if (!this.state.history || this.state.history.length === 0) {
                    list.innerHTML = '<div class="empty-history">还没有粉碎过烦恼哦~</div>';
                    return;
                }
                // Show latest first
                [...this.state.history].reverse().forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'history-item';
                    el.innerHTML = `
                        <div class="history-header">
                            <span>${new Date(item.date).toLocaleString()}</span>
                            <span>${item.monster}</span>
                        </div>
                        <div class="history-content">${item.text}</div>
                        <div class="history-weapon">武器: ${SHOP_ITEMS.find(i => i.id === item.weapon)?.name || '未知'}</div>
                    `;
                    list.appendChild(el);
                });
            }

            addToHistory(text) {
                const monster = this.identifyMonster(text);
                const entry = {
                    date: Date.now(),
                    text: text,
                    monster: monster.name,
                    weapon: this.state.equippedWeapon
                };
                if (!this.state.history) this.state.history = [];
                this.state.history.push(entry);
                // Keep only last 50
                if (this.state.history.length > 50) this.state.history.shift();
                this.saveState();
            }

            toggleSettings() {
                toggleMenu();
            }

            renderDex() {
                const grid = document.getElementById('dexGrid');
                grid.innerHTML = '';
                Object.values(MONSTERS).forEach(m => {
                    const unlocked = this.state.unlockedMonsters.includes(m.id);
                    const el = document.createElement('div');
                    el.className = `dex-item ${unlocked ? 'unlocked' : ''}`;
                    el.innerHTML = `
                        <div class="dex-icon">${unlocked ? m.icon : '❓'}</div>
                        <div class="dex-name">${unlocked ? m.name : '???'}</div>
                    `;
                    grid.appendChild(el);
                });
            }

            showToast(msg) {
                const toast = document.getElementById('toast');
                document.getElementById('toastMsg').innerText = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }
        }

        // --- Global Functions ---
        const game = new Game();

        function toggleMenu() {
            const menu = document.getElementById('menuOverlay');
            menu.classList.toggle('active');
        }

        function openOverlay(id) {
            document.getElementById('menuOverlay').classList.remove('active');
            document.getElementById(id).classList.add('active');
        }

        function closeOverlay(id) {
            document.getElementById(id).classList.remove('active');
        }
