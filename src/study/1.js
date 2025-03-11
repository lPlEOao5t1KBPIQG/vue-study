const obj1 = { a: 1, b: { x: 10 } };
const obj2 = Object.assign({}, obj1);

console.log(obj2);  // { a: 1, b: { x: 10 } }

obj2.a = 2;
obj2.b.x = 20;

console.log(obj1);  // { a: 1, b: { x: 20 } }
console.log(obj2);  // { a: 2, b: { x: 20 } }