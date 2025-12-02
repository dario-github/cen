        // --- Game Data & Config ---
        const LEVELS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

        const MONSTERS = {
            work: { id: 'work', name: '加班狂魔', icon: '🤯', keywords: ['加班', '工作', 'PPT', '老板', '周报'] },
            money: { id: 'money', name: '吃土怪', icon: '💸', keywords: ['穷', '没钱', '账单', '花呗', '房租'] },
            love: { id: 'love', name: '心碎幽灵', icon: '💔', keywords: ['分手', '吵架', '前任', '冷战'] },
            social: { id: 'social', name: '社恐刺猬', icon: '🦔', keywords: ['聚会', '尴尬', '社死', '人际'] },
            body: { id: 'body', name: '焦虑胖胖', icon: '🐷', keywords: ['胖', '丑', '痘痘', '失眠', '脱发'] },
            study: { id: 'study', name: '考试恶魔', icon: '📚', keywords: ['考试', '挂科', '作业', '论文'] },
            traffic: { id: 'traffic', name: '堵车蜗牛', icon: '🐌', keywords: ['堵车', '迟到', '挤地铁'] },
            regret: { id: 'regret', name: '后悔幽灵', icon: '👻', keywords: ['早知道', '后悔', '当初'] },
            envy: { id: 'envy', name: '柠檬精', icon: '🍋', keywords: ['羡慕', '嫉妒', '酸'] },
            doubt: { id: 'doubt', name: '自我怀疑云', icon: '☁️', keywords: ['我不行', '失败', '差劲'] },
            fatigue: { id: 'fatigue', name: '疲惫史莱姆', icon: '💧', keywords: ['累', '困', '不想动'] },
            unknown: { id: 'unknown', name: '无名烦恼', icon: '👾', keywords: [] }
        };

        const THEMES = {
            t_dark: { primary: '#ff9a9e', secondary: '#fad0c4', bg: 'images/bg_dark.png' },
            t_forest: { primary: '#4ade80', secondary: '#bbf7d0', bg: 'images/bg_forest.png' },
            t_candy: { primary: '#f472b6', secondary: '#fbcfe8', bg: 'images/bg_candy.png' },
            t_star: { primary: '#818cf8', secondary: '#c7d2fe', bg: 'images/bg_star.png' }
        };

        const SHOP_ITEMS = [
            { id: 'w_laser', name: '激光射线', type: 'weapon', price: 200, icon: '⚡️', image: 'images/w_laser.png' },
            { id: 'w_bomb', name: '核能爆破', type: 'weapon', price: 500, icon: '💣', image: 'images/w_bomb.png' },
            { id: 'w_blackhole', name: '黑洞吞噬', type: 'weapon', price: 1000, icon: '🕳️', image: 'images/w_blackhole.png' },
            { id: 'w_clock', name: '时间静止', type: 'weapon', price: 2000, icon: '⏰', image: 'images/w_clock.png' },
            { id: 'w_angel', name: '天使净化', type: 'weapon', price: 3000, icon: '👼', image: 'images/w_angel.png' },
            { id: 'w_cat', name: '喵喵拳', type: 'weapon', price: 5000, icon: '🐾', image: 'images/w_cat.png' },
            { id: 't_dark', name: '午夜阳台', type: 'theme', price: 0, icon: '🌃', image: 'images/bg_dark.png' },
            { id: 't_forest', name: '治愈森林', type: 'theme', price: 500, icon: '🌲', image: 'images/bg_forest.png' },
            { id: 't_candy', name: '糖果云端', type: 'theme', price: 1000, icon: '🍬', image: 'images/bg_candy.png' },
            { id: 't_star', name: '浩瀚星河', type: 'theme', price: 2000, icon: '🌌', image: 'images/bg_star.png' },
            { id: 'a_casual', name: '居家阿涔', type: 'avatar', price: 0, icon: '🏠', filter: 'none', image: 'images/a_casual.png' },
            { id: 'a_elegant', name: '优雅阿涔', type: 'avatar', price: 500, icon: '💃', filter: 'brightness(1.1) contrast(1.1) saturate(0.8)', image: 'images/a_elegant.png' },
            { id: 'a_cool', name: '酷盖阿涔', type: 'avatar', price: 800, icon: '😎', filter: 'hue-rotate(240deg) saturate(1.2)', image: 'images/a_cool.png' },
            { id: 'a_fantasy', name: '梦幻阿涔', type: 'avatar', price: 1200, icon: '🧚‍♀️', filter: 'sepia(0.3) saturate(1.5) hue-rotate(-10deg)', image: 'images/a_fantasy.png' },
        ];
