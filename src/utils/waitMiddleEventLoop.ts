import {
  type CallbackType,
  Promise,
  error
} from ".";
import cb from "./cb";
export const waitMiddleEventLoop = (callback: CallbackType = () => { }) => {
  return new Promise<void>(resolve => new Promise<void>(resolve =>
    cb?.(resolve)
  )?.then?.(() =>
    cb?.(() => {
      callback?.();
      resolve?.();
    })
  ).catch?.(error));
};