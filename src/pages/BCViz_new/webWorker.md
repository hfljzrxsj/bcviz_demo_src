# @koale/useworker
根据你的需求，我整理了几种不依赖 React、可在任意 JavaScript 环境中使用且支持 async/await 的 Web Worker 解决方案，并结合相关技术原理给出推荐：

### 一、通用型 Web Worker 异步库推荐
#### 1. **Comlink（Google 出品）**  

• **特点**：通过 RPC 代理实现透明化异步调用，隐藏 postMessage 底层细节，原生支持 Promise。  
• **代码示例**：
  ```javascript
  // 主线程
  import { wrap } from "comlink";
  const worker = new Worker("./worker.js");
  const api = wrap(worker);
  
  // 调用 Worker 方法（async/await 形式）
  const result = await api.heavyTask(data);
  ```

  ```javascript
  // worker.js
  import { expose } from "comlink";
  const obj = { heavyTask: (data) => { /* 耗时计算 */ } };
  expose(obj);
  ```
• **优势**：支持对象方法代理、异常透传、Transferable 数据传输优化，兼容浏览器/Node.js。

#### 2. **Greenlet**  

• **特点**：极简 API，将任意函数自动迁移至 Worker 线程执行。
• **代码示例**：
  ```javascript
  import greenlet from "greenlet";
  
  const fetchData = greenlet(async (url) => {
    return await fetch(url).then(r => r.json());
  });
  
  // 调用（支持 Promise）
  const data = await fetchData("https://api.example.com");
  ```
• **适用场景**：轻量级任务分发，适合非复杂计算场景。

#### 3. **Workerize**  

• **特点**：自动将模块代码打包成 Worker，支持 ES Modules。
• **代码示例**：
  ```javascript
  import workerize from "workerize";
  
  const worker = workerize(`
    export function sort(arr) {
      return arr.sort();
    }
  `);
  
  // 调用
  const sorted = await worker.sort([3,1,2]);
  ```

#### 4. **thread.js**  

• **特点**：支持 SharedWorker 跨标签页通信，提供线程池管理。
• **代码示例**：
  ```javascript
  import { spawn, Thread } from "threads";
  
  const authWorker = await spawn(new Worker("./auth.js"));
  const isValid = await authWorker.validateToken(token);
  await Thread.terminate(authWorker);
  ```

---

### 二、原生方案封装（无依赖）
若需完全自主控制，可参考以下模式封装通用异步 Worker：
```javascript
// asyncWorker.js（通用封装）
export const createAsyncWorker = (taskFunc) => {
  const blob = new Blob([`
    self.onmessage = async (e) => {
      const { id, data } = e.data;
      try {
        const result = await (${taskFunc.toString()})(data);
        self.postMessage({ id, result });
      } catch (error) {
        self.postMessage({ id, error });
      }
    };
  `], { type: "text/javascript" });
  
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  
  return (data) => new Promise((resolve, reject) => {
    const id = Math.random().toString(36);
    worker.onmessage = (e) => {
      if (e.data.id === id) {
        e.data.error ? reject(e.data.error) : resolve(e.data.result);
      }
    };
    worker.postMessage({ id, data });
  });
};

// 使用示例
const heavySort = createAsyncWorker((numbers) => numbers.sort());
const result = await heavySort([...largeArray]);
```

---

### 三、选型建议
| 方案          | 适用场景                          | 优势                     | 参考来源     |
|---------------|-----------------------------------|--------------------------|------------|
| **Comlink**   | 复杂对象方法调用、跨线程状态管理  | API 透明、Google 维护   |    |
| **Workerize** | 需要动态生成 Worker 代码         | 自动代码打包、模块化支持 |    |
| **原生封装**  | 轻量级需求、避免第三方依赖        | 完全可控、无外部开销     |    |

建议优先选择 **Comlink**，其 RPC 设计能显著降低 Worker 使用心智负担。若需更低开销，可基于原生方案二次封装。

以下是几款与 **Greenlet** 类似、**支持内联函数直接转换为 Web Worker** 且无需创建独立文件的库，以及它们的核心特性和代码示例：

---

### 一、类 Greenlet 的内联 Worker 库推荐

#### 1. **workerize (动态代码生成)**  
   • **特点**：将函数或模块代码字符串动态打包为 Web Worker，支持 Promise。
   • **代码示例**：
     ```javascript
     import workerize from "workerize";

     // 内联函数直接转为 Worker
     const worker = workerize(`
       export function add(a, b) {
         return a + b;
       }
     `);

     // 调用（支持 async/await）
     const result = await worker.add(2, 3); // 5
     ```

#### 2. **blob-worker (Blob 动态注入)**  
   • **特点**：通过 Blob 直接注入函数代码，无需单独文件。
   • **代码示例**：
     ```javascript
     import { createWorker } from "blob-worker";

     const worker = createWorker((self) => {
       self.onmessage = (e) => {
         const result = heavyTask(e.data);
         self.postMessage(result);
       };
     });

     const result = await worker.postMessage(data);
     ```

#### 3. **worker-fn (函数序列化)**  
   • **特点**：自动序列化函数和参数，透明化调用 Worker。
   • **代码示例**：
     ```javascript
     import { defineWorker } from "worker-fn";

     const heavyTask = defineWorker((data) => {
       // 耗时计算
       return sortedData;
     });

     // 调用（完全透明）
     const result = await heavyTask(largeArray);
     ```

#### 4. **threads.js (轻量模式)**  
   • **特点**：支持内联函数通过 `spawn` 直接生成 Worker 线程。
   • **代码示例**：
     ```javascript
     import { spawn, Thread } from "threads";

     const task = async (data) => { /* 复杂计算 */ };
     const worker = await spawn(task); // 函数直接转为 Worker
     const result = await worker(data);
     Thread.terminate(worker);
     ```

---

### 二、原生实现方案（无依赖）
若不想引入任何库，可通过 **Blob + URL 动态生成 Worker 脚本**：
```javascript
const createInlineWorker = (func) => {
  // 将函数转为字符串并注入 Worker 脚本
  const code = `self.onmessage = (e) => {
    const result = (${func.toString()})(e.data);
    self.postMessage(result);
  };`;
  
  const blob = new Blob([code], { type: "text/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));
  
  return (data) => new Promise((resolve) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage(data);
  });
};

// 使用示例
const sortWorker = createInlineWorker((arr) => arr.sort());
const sorted = await sortWorker([3,1,2]); // [1,2,3]
```

---

### 三、选型建议
| 库名           | 优势                            | 适用场景                   | 学习成本 |
|----------------|---------------------------------|---------------------------|----------|
| **workerize**  | 支持模块化、动态代码生成        | 复杂函数逻辑              | 低       |
| **worker-fn**  | 完全透明的函数调用              | 简单任务、快速集成        | 极低     |
| **原生实现**   | 零依赖、完全可控                | 轻量需求、避免第三方      | 中       |
| **threads.js** | 线程池、高级调度                | 大规模并发任务            | 中       |

---

### 四、注意事项
1. **函数序列化限制**：内联函数中无法使用闭包变量或外部依赖，需自包含。
2. **浏览器兼容性**：动态 Blob Worker 可能受 CSP 限制（需配置 `unsafe-eval`）。
3. **性能**：高频任务建议预加载 Worker，避免重复创建开销。

推荐优先尝试 **worker-fn** 或 **workerize**，它们提供了最接近 Greenlet 的开发者体验。