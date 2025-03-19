---
title: 算法
date: 2019-01-06
tags:
- 面试题
---

# 参考 **[代码随想录](https://programmercarl.com/)**
## 排序
### 1.冒泡排序

```js
// 冒泡排序
/**
 * 核心思想 
 *    让数组中的当前项和后一项进项比较，如果当前项比后一项大 则两项交换位置 大的靠后
 */
let arr = [12,15,24,8,0,1];
/**
 * 
 * @param {*} ary 
 * @return ary 排序后的数组
 */
function bubble(ary) {
    //外层控制i比较的轮数
    for(let i = 0; i< ary.length -1;i++) {
        //里层控制每一轮比较的次数
        for(let j=0;j< ary.length-1-i;j++) {
            if (ary[j] > ary[j+1]) {
                //当前项大于后一项
                [ary[j+1],ary[j]] = [ary[j],ary[j+1]]
            }
        }
    }
    return ary;

}
console.log(bubble(arr))
```
### 2.插入排序
```js

// 插入排序

let arr = [12,15,24,8,0,1,1,9];
function insert(arr) {
    //1.准备一个新数组 用来存储抓到手里的牌
    let handle = [];
    handle.push(arr[0]);
    //从第二项开始依次抓牌
    for(let i = 1; i < arr.length;i++) {
       let A = arr[i];
       //和手里的牌依次比较 从后向前比
       for(let j = handle.length-1;j>=0;j--) {
             let B= handle[j];
             if (A>B) {
                handle.splice(j+1,0,A);
                break;
             }
             //如果比较到最后一项了 还不比前面的 大 就放到数组最前面
             if (j === 0) {
                handle.unshift(A);
            }
       }

    }
    return handle;
}
console.log(insert(arr));

```
```js
let arr = [2,4,7,1];//从最后一个开始比较
function insert(A,i,x) {
    let p =i- 1;//p指向一下一个被比较的元素
    // p+1指向空位
    while(p >=0 && A[p] > x) { // 24 > 9 
        console.log(p, 'p---') // 2 1
        A[p+1] = A[p];
        console.log(A,'A--') //[ 2, 4, 7, 7 ] [ 2, 4, 4, 7 ] [ 2, 3, 4, 7 ]
        p--; 
    }
    A[p+1]=x;
}
function insert_sort(A) {
    for(let i = 1; i < A.length;i++) {
        //[2,4,7,1]  1  4
        insert(A,i,A[i]);
    }
    return A
}
insert_sort(arr) //[2,4,7,1]
console.log(arr)
```
### 3.快速排序
```js
// 插入排序

let arr = [12,8,15,16,1,24,19];
//找到中间项 把他从以前的数组中移除 获取这一项的结果 15
//拿出每一项 跟中间比 
// 左边的数组 让拿出来的每一项跟中间项继续比较 比中间项小的放到左边 大的放到右边
// 右边的数组
//然后左边数组 右边 重复这个 
function fn() {

}
function quick(arr) {
    //结束递归
    if(arr.length <=0) return arr;
    //找到数组的中间项 在原有的数组中把她删除
    let middleIndex = Math.floor(arr.length / 2);
    let middleValue = arr.splice(middleIndex,1)[0];
    //准备左右两个数组
    let left = [],right= [];
    for(let i =0;i< arr.length;i++) {
        let item = arr[i];
        item < middleValue ? left.push(item) : right.push(item);
    }
    //递归方式 让左右两边的数组持续这样处理 直到左右两边都排好为止


    return quick(left).concat(middleValue,quick(right))
}
console.log(quick(arr));
```
## 二分查找

排好序的数组，找到某个数字对应的位置
```js
function bsearch(A,x) {
    let l = 0,
        r = A.length - 1,
        guess;
  while(l<=r) {
      guess = Math.floor((l+r)/2);
      if (A[guess] === x) return guess;
      else if (A[guess] > x) r = guess -1;
      else l = guess +1;
  }
  return -1;
}
let arr = [12,45,98,67,89]; // 6 / 2
console.log(bsearch(arr,12))
```
## 如何实现一个回文字符串
```js

  function isPali(str, l, r) { // 判断str是否回文
    while (l < r) {            
      if (str[l] != str[r]) {  // 指向的字符不一样，不是回文串
        return false;
      }
      l++;                     // 指针相互逼近
      r--;
    }
    return true;               // 始终没有不一样，返回true
  }
  

  var validPalindrome = function (str) {
    let l = 0, r = str.length - 1; // 头尾指针
    while(l < r) {
        if (str[l] !== str[r]) {
            return isPali(str, l + 1, r) || isPali(str, l, r - 1); //转为判断删掉一个字符后，是否回文
        }
        l++;
        r--;
    }
    return true;
  };
console.log(validPalindrome('ABCDCBA'))
```
## tree 找id

```js

function getId(id) {
  let stack = [...list];
  let index = 0;
  let current;
  while ((current = stack[index++])) {
    if (current.id !== id) {
      stack.concat(current.children);
    } else {
      break;
    }
  }
  if (current) return current;
}
```

## 匹配扩号

```js
const str= '[]{}()';

var isValid = function(s) {
    const n = s.length;
    if (n % 2 === 1) {
        return false;
    }
    const pairs = new Map([
        [')', '('],
        [']', '['],
        ['}', '{']
    ]);
    const stk = [];
    s.split('').forEach(ch => {
        console.log(ch,pairs.has(ch),pairs.get(ch))
        if (pairs.has(ch)) {
            if (!stk.length || stk[stk.length - 1] !== pairs.get(ch)) {
                return false;
            }
            stk.pop();
        } 
        else {
            stk.push(ch);
        }
    });
    return !stk.length;
};

isValid(str)
```
