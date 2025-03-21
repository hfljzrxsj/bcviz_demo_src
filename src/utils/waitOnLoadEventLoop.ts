import {
  type CallbackType,
  Promise,
  addEventListener,
  error
} from ".";
import cb from "./cb";
export const waitOnLoadEventLoop = (callback: CallbackType = () => { }) => addEventListener('load', () => new Promise<void>(resolve =>
  cb?.(resolve)
)?.then?.(() =>
  cb?.(callback)
).catch?.(error));