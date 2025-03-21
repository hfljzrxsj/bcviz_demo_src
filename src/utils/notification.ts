import { isDEV } from "./isEnv";

export const requestPermission = (): ReturnType<(typeof Notification.requestPermission)> => Notification.requestPermission().then(status => {
  if (status === 'denied' || status === 'default') {
    return requestPermission();
  }
  return status;
});
type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};
type NotificationParameters = ConstructorParameters<typeof Notification>;
type PartialOmit = 'data' | 'dir' | 'lang'
  | 'actions' | 'renotify' | 'requireInteraction' | 'silent' | 'tag' | 'timestamp' | 'vibrate' | 'badge' | 'icon' | 'image';
type Option = Required<Omit<NotificationOptions, PartialOmit
>> & NotificationOptions;
const { MAX_SAFE_INTEGER } = Number;
const imgUrl = isDEV ? '/temp.png' : '/1x1-transparent.gif';
//security_watermark.jpg
export const notify = (...args: [NotificationParameters[0], Option]): ReturnType<(typeof Notification.requestPermission)> => Notification.requestPermission().then(status => {
  // if (status !== 'granted') {
  // return notify(...args);
  // }
  const now = Date.now();
  const notification = new Notification(args[0], {
    actions: [],
    renotify: true,
    requireInteraction: true,
    silent: false,
    tag: now.toString(),
    timestamp: now,
    vibrate: MAX_SAFE_INTEGER,
    badge: imgUrl,
    icon: imgUrl,
    image: imgUrl,
    ...args[1],
  });
  notification.addEventListener('click', () => {
    notification.close();
  });
  // new ServiceWorkerRegistration().showNotification(...args);
  return status;
});
