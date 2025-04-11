export const dataConfig = [
    // 动物类
    { name: '猫', seed: 'cat' },
    { name: '狗', seed: 'dog' },
    { name: '猪', seed: 'pig' },
    { name: '鸟', seed: 'bird' },
    { name: '鱼', seed: 'fish' },
    
    // 颜色类
    { name: '红色', seed: 'red' },
    { name: '蓝色', seed: 'blue' },
    { name: '绿色', seed: 'green' },
    { name: '黄色', seed: 'yellow' },
    { name: '黑色', seed: 'black' },
    
    // 水果类
    { name: '苹果', seed: 'apple' },
    { name: '香蕉', seed: 'banana' },
    { name: '梨', seed: 'pear' },
    { name: '橙子', seed: 'orange' },
    { name: '葡萄', seed: 'grape' },
    
    // 学习用品类
    { name: '书', seed: 'book' },
    { name: '钢笔', seed: 'pen' },
    { name: '铅笔', seed: 'pencil' },
    { name: '尺子', seed: 'ruler' },
    { name: '橡皮', seed: 'eraser' }
  ];

  export function getRandomItems(arr, count = 3) {
    // 创建数组副本以避免修改原数组
    const shuffled = [...arr];
    
    // Fisher-Yates 洗牌算法
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // 返回前 count 个元素
    return shuffled.slice(0, count);
  }
  
  // 使用方法：
  export const data = getRandomItems(dataConfig);
  console.log(data);
// 创建玩家形状网格
export function createShapeMesh(type) {
    let geometry;
    if (type === "circle") {
        geometry = new THREE.CircleGeometry(0.4, 32);
    } else if (type === "square") {
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
    } else {
        geometry = new THREE.ConeGeometry(0.6, 0.2, 3);
    }

    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );

    // 如果是正方形，旋转90度
    if (type === "square") {
        mesh.rotation.z = Math.PI / 4;
    }

    if (type === "triangle") {
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.y = Math.PI / 2;
    }

    return mesh;
}
// 根据类型获取孔洞路径
function getHolePath(type) {
    const hole = new THREE.Path();
    const radius = 0.5; // 孔洞半径
    if (type === "circle") {
        // 圆形孔洞
        hole.absarc(0, 0, radius, 0, Math.PI * 2, true);
    } else {
        // 多边形孔洞
        const sides = type === "square" ? 4 : 3; // 正方形4边，三角形3边
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2; // 计算角度
            const x = Math.cos(angle) * radius; // x坐标
            const y = Math.sin(angle) * radius; // y坐标
            if (i === 0) hole.moveTo(x, y); // 移动到起点
            else hole.lineTo(x, y); // 绘制边
        }
    }
    return hole;
}
function createTextSprite(text) {
    const canvasWidth = 512;
    const canvasHeight = 512/2;
    const scaleFactor = 2;
    const padding = 10; // 增加边距
    const minFontSize = 40; // 最小字号

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth * scaleFactor;
    canvas.height = canvasHeight * scaleFactor;
    const context = canvas.getContext('2d');
    context.scale(scaleFactor, scaleFactor);

    // 绘制背景
    context.fillStyle = '#deb887';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // 动态计算字号（新增核心逻辑）
    let fontSize = 100;
    let textWidth;
    const maxWidth = canvasWidth - padding * 2; // 可用宽度

    do {
        context.font = `bold ${fontSize}px Arial`;
        textWidth = context.measureText(text).width;
        if (textWidth <= maxWidth) break;
        fontSize -= 2;
    } while (fontSize > minFontSize);

    // 设置文字样式
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // 计算文字位置（动态垂直居中）
    const textX = canvasWidth / 2;
    // const textY = (canvasHeight - fontSize) / 2; // 垂直居中
    const textY = 30;
    // 绘制文字描边
    context.strokeStyle = 'white';
    context.lineWidth = Math.max(10, fontSize / 25); // 动态描边粗细
    context.strokeText(text, textX, textY);

    // 绘制文字填充
    context.fillText(text, textX, textY);

    // 调试用：保存图片到本地
    // const link = document.createElement('a');
    // link.href = canvas.toDataURL();
    // link.download = 'text_debug.png';
    // link.click();

    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}
// 创建障碍物
export function createWallWithHole(type, text,options) {
    const config = {
        width: 2,
        height: 2,
        holeOffset: 0.1, // 下移比例
        ...options
    }
    const wallWidth = config.width;
    const wallHeight = config.height;
    // 创建形状（必须闭合路径）
    const outer = new THREE.Shape();
    outer.moveTo(-wallWidth/2, -wallHeight/2); // 左下
    outer.lineTo(-wallWidth/2, wallHeight/2);  // 左上（Y轴增加）
    outer.lineTo(wallWidth/2, wallHeight/2);   // 右上
    outer.lineTo(wallWidth/2, -wallHeight/2);  // 右下
    outer.lineTo(-wallWidth/2, -wallHeight/2); // 闭合路径
    // 添加孔洞（确保路径合法）
    const hole = getHolePath(type,wallHeight * 0.3);
    outer.holes.push(hole);

    // 创建BufferGeometry
    const geometry = new THREE.ShapeBufferGeometry(outer);
    // 创建材质
    const material = new THREE.MeshStandardMaterial({
        map: createTextSprite(text),
        side: THREE.DoubleSide
    });
    material.map.offset.set(0.5, 0); // X轴向左偏移25%
    material.map.repeat.set(0.5, 1);   // X轴缩放50%
    return new THREE.Mesh(geometry, material);
}


// iframe通信
export const sendMessage = (data) => {
    window.parent.postMessage(JSON.stringify(data),"*")
}

const receiveMessage = () => {
    
}

window.addEventListener('message',receiveMessage)
