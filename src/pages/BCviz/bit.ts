// const num = 6; // 二进制表示为 110

// 获取第 n 位的值（n 从 1 开始）
export default function getBit (num: number, n: number) {
  return (num >> n) & 1;
}

// console.log(getBit(num, 0)); // 输出: 0
// console.log(getBit(num, 1)); // 输出: 1
// console.log(getBit(num, 2)); // 输出: 1
// // console.log(getBit(num, 3)); // 输出: 1