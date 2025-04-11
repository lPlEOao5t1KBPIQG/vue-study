
import { createShapeMesh, sendMessage, createWallWithHole, data } from "./utils.js"; // 导入创建玩家形状的函数
let scene, camera, renderer; // Three.js核心对象
let shape,
    track,
    shapeType = "triangle"; // 玩家形状、轨道和当前形状类型
let obstacles = []; // 障碍物数组
let successInfo = document.getElementById("success"); // 获取UI信息元素
let scoreDiv = document.getElementById("score-inner"); // 获取分数元素
let currentWordDiv = document.getElementById("current-word"); // 获取当前单词元素
let currentObstacleIndex = 0; // 当前障碍物索引
let state = "forward"; // 玩家移动状态(前进/后退)
let bounceTargetZ = 0; // 反弹目标位置
let score = 0; // 玩家分数
const scoreConfig = 1000; // 每通过一个障碍物增加的分数
// 准备 5个单词 复杂一点的单词
const words = data.map((item) => item.seed); // 获取单词数组

// ui 层 更改玩家形状
function updateShapeTo(type) {
    shapeType = type; // 更新当前形状类型
    const newShape = createShapeMesh(type);
    newShape.position.copy(shape.position);
    scene.remove(shape);
    shape = newShape;
    scene.add(shape);
}
const container = document.getElementById('gallery');
let timerId = undefined
// 事件委托：监听 gallery 容器的点击事件
const notify = (type,callback) => {
    if (timerId !== undefined) clearTimeout(timerId)
    function notifyFunc() {
        if(answerStatus !== 'answered')  return;
       
        sendMessage({ type })
        switch (type) {
            case 'right':
                console.log('回答正确，继续前进');
                break;
            case 'error':
                console.log('回答错误，触发反弹');
                break;
            case 'end':
                console.log('结束游戏');
                break;
        }
        if(callback) callback()
    }
    if (type === 'right') {
        timerId = setTimeout(() => {
            notifyFunc()
        }, 500)
    } else {
        notifyFunc()
    }
}
let answerStatus = '';
container.addEventListener('click', function (e) {

    const galleryItem = e.target.closest('.gallery-item');

    // 判断点击的元素是否是 gallery-item
    if (galleryItem) {
        const seed = galleryItem.dataset.seed;
        const name = galleryItem.dataset.name;
        console.log('你点击的是：', name, '(seed:', seed + ')');

        const currentWord = words[currentObstacleIndex];
        const obstacle = obstacles[currentObstacleIndex];
        // 判断当前障碍物的形状类型
        console.log('obstacles', currentObstacleIndex, currentWord, seed, obstacle.userData.type, shapeType)
        if (shapeType !== obstacle.userData.type) {
            answerStatus = 'answered'
            if (currentWord === seed) {
                updateShapeTo(obstacle.userData.type)
            }
        }


    }
});
currentWordDiv.textContent = `${words[currentObstacleIndex]}`; // 更新当前单词

// 初始化游戏并开始动画循环
init();
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
animate();
// 调试用辅助线
// const helper = new THREE.AxesHelper(50);
// scene.add(helper);

function createTrack() {
    // 加载纹理
    // const texture = new THREE.TextureLoader().load(
    //     'https://threejs.org/examples/textures/terrain/grasslight-big.jpg'
    // );
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(1, 10);

    const material = new THREE.MeshStandardMaterial({ color: 0x333344 }); // 材质(绿色)
    const geometry = new THREE.BoxGeometry(2, 0.1, 500) // 几何体(宽2,高0.1,长500
    // const geometry = new THREE.PlaneGeometry(10, 50, 50, 50); // 宽、长、细分
    // // // 添加弯曲弧度（Z方向）
    // const position = geometry.attributes.position;
    // for (let i = 0; i < position.count; i++) {
    //   const y = position.getY(i);
    //   const bend = Math.sin((y / 50) * Math.PI) * 1; // 控制弯曲高度
    //   position.setZ(i, bend);
    // }
    // position.needsUpdate = true;
    // geometry.computeVertexNormals();


    track = new THREE.Mesh(
        geometry,
        material
    );
    track = new THREE.Mesh(geometry, material);
    track.position.y = -1; // 稍微低于地面
    track.position.z = -200; // 向后延伸
    scene.add(track);
}



// 初始化函数 - 设置Three.js场景
function init() {
    // 创建场景
    scene = new THREE.Scene();

    // 设置透视相机
    camera = new THREE.PerspectiveCamera(
        55, // 视野角度
        window.innerWidth / window.innerHeight, // 宽高比
        0.1, // 近裁剪面
        300 // 远裁剪面
    );
    camera.position.set(2, 0, 5); // 设置相机位置
    camera.lookAt(0, 0, 0); // 相机看向原点

    // 创建WebGL渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 开启抗锯齿
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器尺寸
    renderer.setClearColor(0x000000, 0); // alpha = 0，背景透明
    // 拿到 canvas DOM
    const canvas = renderer.domElement;
    // 设置层级
    canvas.style.position = 'relative';  // 或 'absolute' / 'fixed'
    canvas.style.zIndex = '100';         // 确保大于 video 的 z-index
    // canvas.style.top = '100px';
    canvas.style.left = '0';
    // canvas.style.scale = '1.5'
    document.body.appendChild(renderer.domElement); // 添加到DOM

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight); // 添加环境光源
    // 添加平行光源
    // const light = new THREE.DirectionalLight(0xffffff, 1); // 白色光源，强度1
    // light.position.set(0, 5, 10); // 设置光源位置
    // scene.add(light); // 添加到场景

    // 创建轨道(跑道)
    createTrack()
    // 创建玩家形状
    shape = createShapeMesh(shapeType); // 初始为圆形
    shape.position.set(0, -0.1, 2); // 设置初始位置
    scene.add(shape); // 添加到场景
    // 创建障碍物
    const types = ["circle", "square", "triangle"]; // 三种形状类型
    for (let i = 0; i < words.length; i++) {
        // 创建15个障碍物
        const type = types[i % types.length]; // 循环使用三种形状
        const wall = createWallWithHole(type, words[i]); // 创建带孔的墙
        wall.position.z = -i * 7 - 2; // 沿z轴分布
        // wall.position.y = 1
        wall.userData.type = type; // 存储形状类型
        wall.userData.checked = false; // 标记是否已通过
        scene.add(wall); // 添加到场景
        obstacles.push(wall); // 添加到障碍物数组
    }
    // 窗口大小调整事件
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight; // 更新相机宽高比
        camera.updateProjectionMatrix(); // 更新投影矩阵
        renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器尺寸
    });
}

// 动画循环函数
function animate() {
    requestAnimationFrame(animate); // 请求下一帧动画
    updateState();
    shapeFollowCamera()
    checkCollision(); // 检查碰撞
    renderer.render(scene, camera); // 渲染场景
    // controls.update();
}

//  相机跟随玩家

function shapeFollowCamera() {
    // 相机动画 - 轻微晃动效果
    camera.position.x = 2
    camera.position.y = 1
    camera.position.z = shape.position.z + 5; // 相机跟随玩家
    camera.lookAt(shape.position); // 相机始终看向玩家
}
// 更改
function updateState() {
    const speed = 0.04; // 移动速度

    // 根据状态移动玩家
    if (state === "forward") {
        shape.position.z -= speed; // 向前移动
    } else if (state === "backward") {
        // 删除已经通过障碍物
        obstacles.forEach((obstacle, index) => {
            if (obstacle.userData.checked) {
                scene.remove(obstacle); // 从场景中移除
            }
        });
        shape.position.z += speed; // 向后移动(反弹)
        if (shape.position.z >= bounceTargetZ) {
            state = "forward"; // 到达反弹目标后恢复前进
        }
    }
}

// 游戏碰撞逻辑
function checkCollision() {
    // 碰撞检测
    obstacles.forEach((obstacle, index) => {
        // 检查是否接近未通过的障碍物且正在前进

        if (
            !obstacle.userData.checked &&
            shape.position.z <= obstacle.position.z + 0.5 &&
            state === "forward"
        ) {
            // 如果玩家形状与障碍物孔形状匹配
            console.log('obstacle', obstacle.userData.type, shapeType, obstacle.userData.type === shapeType)
            if (obstacle.userData.type === shapeType) {
                // info.textContent = `✅ Passed: ${shapeType}`; // 显示通过信息
                obstacle.userData.checked = true; // 标记为已通过
                score += scoreConfig; // 增加分数
                // scoreDiv.textContent = `${score}`; // 更新分数显示
                state = "forward"; // 继续前进
                currentObstacleIndex++; // 增加障碍物索引
                console.log("通过障碍物", obstacle.userData.type, currentObstacleIndex);
                // 当shape 移动到下一个障碍物时 删除已通过障碍物
                // 更新提示为下一个障碍物形状
                if (currentObstacleIndex < obstacles.length) {
                    const nextType = obstacles[currentObstacleIndex].userData.type;
                    currentWordDiv.textContent = `${words[currentObstacleIndex]}`; // 更新当前单词
                    notify('right',() => {
                        answerStatus = ''
                    })
                } else {
                    // successInfo.textContent = "you win!"; // 全部通过
                    // successInfo.style.fontSize = "50px"; // 增大字体
                    // successInfo.style.color = "red"; // 改变颜色
                    notify('right',() => {
                        answerStatus = ''
                    })                }
            } else {
                // 形状不匹配，触发反弹
                bounceTargetZ = shape.position.z + 2; // 设置反弹目标位置
                state = "backward"; // 改变状态为后退
                notify('error')
                answerStatus = ''
            }
        }
    });
}
