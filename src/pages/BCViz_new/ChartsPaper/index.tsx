import type { Children } from "@/types/children";
import { Paper } from "@mui/material";
import { TabPanel, type TabPanelProps } from "@mui/lab";
import { useEffect, useRef } from "react";
import { head, isEqual } from "lodash";
import { useEventListener, useMemoizedFn, useKeyPress, useUpdate, useMount, useUnmount } from 'ahooks';
import { debounce } from "@/pages/BCviz/utils";
import { waitLastEventLoop } from "@/utils";
import { useGestureFullScreen } from "../hooks/useGestureFullScreen.mjs";
const { error } = console;

export default function ChartsTabPanel ({ children, ...TabPanelProps }: Children & TabPanelProps) {
  const ref = useGestureFullScreen();
  return <TabPanel {...TabPanelProps}
    ref={ref}
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
    {/* <Paper elevation={24}
    // style={{ minHeight: '87vh' }}
    // className={style['Chart'] ?? ''}
    > */}
    {children}
    {/* </Paper> */}
  </TabPanel>;
}