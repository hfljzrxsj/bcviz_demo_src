import { waitLastEventLoop } from "./waitLastEventLoop";
import { waitMiddleEventLoop } from "./waitMiddleEventLoop";
import { waitOnLoadEventLoop } from "./waitOnLoadEventLoop";
export type CallbackType = (...args: unknown[]) => unknown;
export const {
  Promise,
  addEventListener,
  console: {
    error,
  } = {},
  MessageChannel,
  queueMicrotask,
  requestAnimationFrame,
  requestIdleCallback,
  setTimeout,
} = window ?? self ?? globalThis ?? this;
export { waitLastEventLoop, waitMiddleEventLoop, waitOnLoadEventLoop };