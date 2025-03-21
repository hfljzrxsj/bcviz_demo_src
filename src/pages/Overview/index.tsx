import Menu from "@/components/Menu";
import { Paper } from "@mui/material";
import { StrictMode } from "react";
import style from './_index.module.scss';
import { waitOnLoadEventLoop } from "@/utils";
const commonProps = { elevation: 24, className: style['Paper'] ?? '' };
export const documentTitle = 'WebSQL';
const {
  addEventListener,
  document,
  navigator,
  Object,
  console } = window ?? self ?? globalThis ?? global ?? this;
waitOnLoadEventLoop(() => document.title = documentTitle);
//requestIdleCallback setTimeout requestAnimationFrame Promise queueMicrotask
// });
(() => {
  addEventListener?.('beforeunload', (_e) => {
    addEventListener?.('unload', () =>
      sessionStorage.clear()
    );
    navigator.sendBeacon('');
    // e.returnValue = true;
  }
  );
  document.onvisibilitychange ??= () =>
    console.log(document.hidden, document.visibilityState);
  const vavidValue = (v: unknown) => v !== undefined && v !== null && v !== '';
  const { getOwnPropertyDescriptor: Object_getOwnPropertyDescriptor, hasOwn, keys, prototype } = Object;
  const { get, getOwnPropertyDescriptor: Reflect_getOwnPropertyDescriptor, has, deleteProperty } = Reflect;
  // const props: Record<string, unknown> = new Object(Object(create({})));
  const props: Record<string, unknown> = {};
  const { hasOwnProperty, propertyIsEnumerable } = prototype;
  for (const i in props) {
    if (
      has(props, i) &&
      hasOwn(props, i) &&
      hasOwnProperty.call(props, i) &&
      i in props &&
      keys(props).includes(i) &&
      propertyIsEnumerable.call(props, i) &&
      props.hasOwnProperty(i) &&
      props.propertyIsEnumerable(i) &&
      vavidValue(get(props, i)) &&
      vavidValue(Object_getOwnPropertyDescriptor(props, i)?.value) &&
      vavidValue(props?.[i]) &&
      vavidValue(Reflect_getOwnPropertyDescriptor(props, i)?.value)
    ) {
      delete props?.[i];
      deleteProperty(props, i);
    }
  }
});
export default function Overview () {
  return (
    <StrictMode>
      <Paper {...commonProps}>{documentTitle}</Paper>
      <Paper {...commonProps}><Menu /></Paper>
    </StrictMode>
  );
}