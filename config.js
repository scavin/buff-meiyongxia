// config.js - 超简洁URL编码配置
const CONFIG = {
    BASE_URL: 'https://buff.meiyongxia.com'
};

// 参数映射表 - 17个参数，每个最多8个等级
const PARAM_MAP = {
    // 按字母顺序排列，便于记忆
    'a': 'white-meat',        // 白肉 (0-7)
    'b': 'vegetables-fruits', // 蔬果 (0-5) 
    'c': 'nuts',             // 坚果 (0-7)
    'd': 'spicy-food',       // 辛辣 (0-7)
    'e': 'avoid-processed',  // 避免加工 (0-4)
    'f': 'coffee',           // 咖啡 (0-5)
    'g': 'tea',              // 茶 (0-5)
    'h': 'milk',             // 牛奶 (0-3)
    'i': 'no-alcohol',       // 戒酒 (0-4)
    'j': 'racquet-sports',   // 挥拍运动 (0-5)
    'k': 'vigorous-exercise', // 剧烈运动 (0-7)
    'l': 'walking',          // 步行 (0-4)
    'm': 'sleep',            // 睡眠 (0-4)
    'n': 'brush-teeth',      // 刷牙 (0-3)
    'o': 'sunlight',         // 晒太阳 (0-4)
    'p': 'no-smoking',       // 戒烟 (0-4)
    'q': 'weight-management' // 体重管理 (0-4)
};

// 反向映射
const REVERSE_MAP = Object.fromEntries(
    Object.entries(PARAM_MAP).map(([key, value]) => [value, key])
);

// 新的超简洁编码函数
function generateCompactShareId() {
    let result = '';
    
    // 按字母顺序处理参数
    for (let letter of 'abcdefghijklmnopq') {
        const actionName = PARAM_MAP[letter];
        const slider = document.querySelector(`[data-action="${actionName}"]`);
        
        if (slider) {
            const value = parseInt(slider.value);
            if (value > 0) {
                result += letter + value;
            }
        }
    }
    
    return result || '0'; // 如果没有任何设置，返回'0'
}

// 解码函数
function decodeCompactShareId(shareId) {
    const data = {};
    
    if (shareId === '0') {
        return data; // 空数据
    }
    
    // 解析格式如 "a3b2c5" 
    const matches = shareId.match(/([a-q])(\d)/g);
    if (matches) {
        matches.forEach(match => {
            const letter = match[0];
            const value = parseInt(match[1]);
            const actionName = PARAM_MAP[letter];
            if (actionName) {
                data[actionName] = value;
            }
        });
    }
    
    return data;
}

// 向后兼容的解码函数
function decodeShareId(shareId) {
    // 新格式：简洁编码 (如 "a3b2c5")
    if (/^[a-q0-9]*$/.test(shareId)) {
        return decodeCompactShareId(shareId);
    }
    
    // 旧格式：base64编码
    try {
        const restored = shareId.replace(/-/g, '+').replace(/_/g, '/');
        const padded = restored + '=='.slice(0, (4 - restored.length % 4) % 4);
        return JSON.parse(atob(padded));
    } catch (e) {
        console.error('Failed to decode share ID:', e);
        return {};
    }
}

// 检查是否在浏览器环境中
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.generateCompactShareId = generateCompactShareId;
    window.decodeShareId = decodeShareId;
}