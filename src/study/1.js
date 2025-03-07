// 创建一个简单的双向绑定实现
class Vue3Binding {
    constructor(data) {
      this.data = this.createProxy(data);
    }
  
    // 创建代理对象
    createProxy(data) {
      const self = this;
  
      return new Proxy(data, {
        get(target, prop) {
          console.log(`Getting value of ${prop}:`, target[prop]);
          return target[prop];
        },
        set(target, prop, value) {
          console.log(`Setting value of ${prop}:`, value);
          target[prop] = value;
  
          // 这里可以进行视图更新的逻辑，例如调用视图更新函数
          self.updateView(prop, value);
  
          return true;
        }
      });
    }
  
    // 模拟更新视图的函数
    updateView(prop, value) {
      console.log(`Update view for ${prop}:`, value);
      // 这里可以进行实际的DOM更新操作
    }
  }
  
  // 使用实例
  const data = {
    message: 'Hello, Vue3!',
  };
  
  // 创建 Vue3Binding 实例
  const vueInstance = new Vue3Binding(data);
  
  // 模拟双向绑定：设置数据并观察如何更新
  console.log(vueInstance.data.message); // 获取属性
  vueInstance.data.message = 'Hello, Vue3 Proxy!'; // 设置属性，触发视图更新
  
  // 此时控制台将输出：
  /*
  Getting value of message: Hello, Vue3!
  Setting value of message: Hello, Vue3 Proxy!
  Update view for message: Hello, Vue3 Proxy!
  */
  
  //fitst
  // 冒泡排序
  function bubbleSort(arr) {
    const len = arr.length;
    console.log(len);
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
  
  // 使用示例
  const arr = [5, 3, 8, 4, 2];
  console.log(bubbleSort(arr)); // [2, 3, 4, 5, 8]
  //test

  // 前序遍历算法
function preorderTraversal(root) {
    if (!root) return [];
  
    const result = [];
    const stack = [root];
  
    while (stack.length) {
      const node = stack.pop();
      result.push(node.val);
  
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
  
    return result;
  }