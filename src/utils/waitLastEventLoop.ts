import {
  type CallbackType,
  Promise,
  error
} from ".";
import cb from "./cb";
export const waitLastEventLoop = (callback: CallbackType = () => { }) => new Promise<void>(resolve =>
  cb?.(resolve)
)?.then?.(() =>
  cb?.(callback)
).catch?.(error);