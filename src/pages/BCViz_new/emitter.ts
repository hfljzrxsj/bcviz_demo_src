// import Emitter from 'component-emitter';
// import Emittery from 'emittery';
// import { } from 'eventemitter3';
// import { EventEmitter } from 'events';
// import { } from '@algolia/events';
// import EventLite from "event-lite";
// import { EventTarget, Event } from "event-target-shim";
// import { } from 'rxjs';

const eventTarget = new EventTarget();
// new EventCounts;
// 订阅函数，用于订阅特定事件
function subscribe (...args: Parameters<EventTarget["addEventListener"]>) {
  eventTarget.addEventListener(...args);
}

// 发布函数，用于发布特定事件并传递数据
function publish (eventName: string, data: CustomEventInit['detail']) {
  // 创建一个自定义事件
  // 触发自定义事件
  dispatchEvent(new CustomEvent(eventName, {
    detail: data
  }));
}

// 取消订阅函数，用于取消特定事件的订阅
function unsubscribe (...args: Parameters<EventTarget["removeEventListener"]>) {
  eventTarget.removeEventListener(...args);
}

// 示例订阅者回调函数
function subscriberCallback (event: CustomEventInit & Event) {
  console.log(`Received event: ${event.type} with data:`, event.detail);
}

// 订阅事件
subscribe('newMessage', subscriberCallback);

// 发布事件
publish('newMessage', { message: 'Hello, World!' });

// 取消订阅
unsubscribe('newMessage', subscriberCallback);

// 再次发布事件，此时订阅者不会收到通知
publish('newMessage', { message: 'This message should not be received.' });