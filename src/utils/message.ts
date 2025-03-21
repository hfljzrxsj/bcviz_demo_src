const funcs: Set<Function> = new Set();
let lastTime = Date.now();
export const on = (func: Function) => {
  funcs.add(func);
};
export const emit = () => {
  const now = Date.now();
  if (now - lastTime > 1e3) {
    for (const func of funcs.values()) {
      func();
    }
  }
  lastTime = now;
};
export const del = (func: Function) => {
  funcs.delete(func);
};
export const setLastTime = (time: number) => {
  lastTime = time;
};