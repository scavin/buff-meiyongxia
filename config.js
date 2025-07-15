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

// 生成分享ID - 定长编码
function generateShareId() {
    let result = '';
    
    // 按字母顺序处理所有参数，用单个字符表示等级
    for (let letter of 'abcdefghijklmnopq') {
        const actionName = PARAM_MAP[letter];
        const slider = document.querySelector(`[data-action="${actionName}"]`);
        
        if (slider) {
            const value = parseInt(slider.value);
            // 使用0-9表示等级0-9，超过9用a-z表示（实际上健康参数最多8个等级）
            result += value <= 9 ? value.toString() : String.fromCharCode(87 + value); // 87 = 'a'.charCodeAt(0) - 10
        } else {
            result += '0'; // 默认值
        }
    }
    
    // 去掉末尾的0，进一步压缩
    result = result.replace(/0+$/, '');
    
    return result || '0'; // 如果没有任何设置，返回'0'
}

// 解码分享ID - 定长解码
function decodeShareId(shareId) {
    const data = {};
    
    if (shareId === '0') {
        return data; // 空数据
    }
    
    // 定长解码：每个位置对应一个参数
    const letters = 'abcdefghijklmnopq';
    for (let i = 0; i < Math.min(shareId.length, 17); i++) {
        const char = shareId[i];
        const letter = letters[i];
        const actionName = PARAM_MAP[letter];
        
        if (actionName) {
            let value;
            if (char >= '0' && char <= '9') {
                value = parseInt(char);
            } else {
                // 扩展字符支持（虽然当前不需要）
                value = char.charCodeAt(0) - 87; // 'a'.charCodeAt(0) - 10
            }
            
            if (value > 0) {
                data[actionName] = value;
            }
        }
    }
    
    return data;
}

// 检查是否在浏览器环境中
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.generateShareId = generateShareId;
    window.decodeShareId = decodeShareId;
}