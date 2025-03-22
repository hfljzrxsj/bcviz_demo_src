import type { Children } from "@/types/children";
import { Paper } from "@mui/material";
import { TabPanel, type TabPanelProps } from "@mui/lab";
import { useEffect, useRef } from "react";
import { head, isEqual } from "lodash";
import { useEventListener, useMemoizedFn, useKeyPress, useUpdate, useMount, useUnmount } from 'ahooks';
import { debounce } from "@/pages/BCviz/utils";
import { waitLastEventLoop } from "@/utils";
const { error } = console;
type Child = EventTarget | ChildNode | Element | null | undefined;
export function allEqual (...args: ReadonlyArray<unknown>): boolean {
  if (args.length === 0) {
    return true;
  }
  const firstValue = head(args);
  return args.every((value) => isEqual(value, firstValue));
}
const isAllCount = (num: number, args: ReadonlyArray<number>) => {
  return args.every(i => i === num);
};
const isRightDom = (current: Child): current is HTMLDivElement => {
  if (!(current instanceof HTMLDivElement)) {
    return false;
  }
  const { childElementCount, childNodes, children, firstChild, lastChild, firstElementChild, lastElementChild } = current;
  if (
    !current.hasChildNodes()
    || !isAllCount(1, [childElementCount, childNodes.length, children.length])
  ) {
    return false;
  }
  return allEqual(firstChild, lastChild, firstElementChild, lastElementChild, childNodes.item(0), children.item(0));
};
const mouseup = 'mouseup';

const fullscreenKeyPress = ['ctrl', 'alt', 'shift', 'meta'].map(i => `${i}.f11`);
export default function ChartsTabPanel ({ children, ...TabPanelProps }: Children & TabPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { current } = ref;
  // const fullScreenEle = useMemo(() => {
  //   if (!isRightDom(current)) {
  //     return null;
  //   }
  //   const fullScreenEle = current?.firstChild;
  //   if (!isRightDom(fullScreenEle)) {
  //     return null;
  //   }
  //   return fullScreenEle;
  // }, [current]);
  const getFullScreenEle = useMemoizedFn((current: HTMLDivElement | null) => {
    if (!isRightDom(current)) {
      return null;
    }
    const fullScreenEle = current?.firstChild;
    if (!isRightDom(fullScreenEle)) {
      return null;
    }
    return fullScreenEle;
  });
  const openFullScreen = useMemoizedFn(debounce(((fullScreenEle: HTMLDivElement | null) => {
    if (fullScreenEle instanceof HTMLDivElement && !document.fullscreenElement) {
      return fullScreenEle.requestFullscreen({
        navigationUI: 'hide'
      })
        // .then(console.log
        //   , error)
        .catch(error);
    }
    return Promise.reject(fullScreenEle);
  })));
  useUnmount(() => {
    openFullScreen.cancel?.();
    openFullScreen.clear?.();
  });
  const clickEvent = useMemoizedFn(((e: Event) => {
    const fullScreenEle = getFullScreenEle(current);
    const { target, currentTarget } = e;
    if (!fullScreenEle || !allEqual(current, target, currentTarget)) {
      return;
    }
    if (e instanceof MouseEvent) {
      const { button, altKey, ctrlKey, metaKey, shiftKey, relatedTarget, type } = e;
      if (type === mouseup && (button === 0) && (!altKey && !ctrlKey && !metaKey && !shiftKey) && !relatedTarget) {
        return;
      }
    }
    e.preventDefault();
    return openFullScreen(fullScreenEle);
  }));

  // useEffect(() => {
  // current.addEventListener('click', clickEvent);
  // outerDiv.addEventListener('dblclick', function (event) {
  //   // 检查点击的目标元素是否为内层 div 或其后代元素
  //   if (!innerDiv.contains(event.target)) {
  //     // 如果点击位置不在内层 div 内，则执行以下函数
  //     handleDoubleClick();
  //   }
  // });
  // current?.addEventListener('dblclick', (e) => {

  // });
  // return () => {
  //   current.removeEventListener('dblclick', clickEvent);
  // };
  // }, []);
  useEventListener([
    'contextmenu',  //右键
    'dblclick', //双击
    'auxclick', //右键或中键，因兼容性似乎没反应
    mouseup, //右键或中键
  ] as (keyof HTMLElementEventMap)[], clickEvent, {
    enable: Boolean(current),
    target: current
  });
  useKeyPress(fullscreenKeyPress, (e) => {
    const fullScreenEle = getFullScreenEle(current);
    return openFullScreen(fullScreenEle);
  }, { exactMatch: true });
  const updateForce = useUpdate();
  useMount(() => {
    waitLastEventLoop(() => {
      if (!current) {
        updateForce();
      }
    });
  });
  return <TabPanel {...TabPanelProps} ref={ref}
  // key={getKey(TabPanelProps.value as TabKey)}
  // onContextMenu={(e) => e.preventDefault()}
  // onMouseUp={(e) => e.preventDefault()}
  // onMouseDown={(e) => e.preventDefault()}
  // onAuxClick={(e) => {
  //   console.log(e);
  //   e.preventDefault();
  // }}
  // onClick={() => {
  //   const fullScreenEle = getFullScreenEle(current);
  //   console.log(current, fullScreenEle);
  // }}
  >
    <Paper elevation={24}
    // style={{ minHeight: '87vh' }}
    // className={style['Chart'] ?? ''}
    >
      {children}
    </Paper>
  </TabPanel>;
}