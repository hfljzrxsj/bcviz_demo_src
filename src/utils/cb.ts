import {
  Promise,
  error,
  MessageChannel,
  queueMicrotask,
  requestAnimationFrame,
  requestIdleCallback,
  setTimeout,
} from ".";
const {
  // BroadcastChannel,
} = window ?? self ?? globalThis ?? this;
export default (resolve: () => void = () => { }) =>
  requestIdleCallback?.(() => setTimeout?.(() =>
    requestAnimationFrame?.(() =>
      queueMicrotask?.(() =>
        Promise?.resolve?.()?.then?.(() => {
          // const { length, name, toString } = resolve;
          // const channel = new BroadcastChannel(Date?.now?.()?.toString?.());
          // channel?.postMessage(null);
          // channel.onmessage = () => {
          const { port1, port2 } = new MessageChannel();
          port1?.postMessage?.(null);
          port2.onmessage = resolve;
          // };
        }
        ).catch?.(error)
      )
    )
  )
  ); 