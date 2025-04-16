import { Paper, Fab, IconButton } from "@mui/material";
import style from './_index.module.scss';
// import clsx from 'clsx';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import type { Children } from "@/types/children";
import classNames from 'clsx';
import { useRef } from "react";
import { isRightDom } from "../hooks/useGestureFullScreen.mjs";
const title = "enter page fullscreen";
export default function ({ children, isInFullScreen, isShow, ...fabProps }: Children & {
  readonly isInFullScreen: boolean;
  readonly isShow: boolean;
  // readonly fabProps:
} & Parameters<typeof Fab>[0]) {
  const isNotShow = !isShow;
  const ref = useRef<HTMLDivElement>(null);
  return <>
    <Paper className={classNames(style['relative'], { [style['width0'] ?? '']: isNotShow })} elevation={24} ref={ref}
    // style={{width:isShow?'100%':0}}
    >
      <Fab
        size='large'
        // onClick={setTrue}
        // title="enter page fullscreen"
        className={classNames(style['Fab'], {
          [style['opacity0'] ?? '']: isNotShow
        })}
        onContextMenu={(e) => {
          const { current } = ref;
          if (current instanceof HTMLDivElement) {
            const { lastChild, lastElementChild } = current;
            if (lastChild === lastElementChild && lastChild instanceof HTMLDivElement) {
              lastChild.requestFullscreen({
                navigationUI: 'hide',
              });
            }
          }
          e.preventDefault();
          return;
        }}
        hidden={isNotShow}
        {...fabProps}
      >
        {/* <Tooltip title="settings" arrow> */}
        <IconButton size='large'>
          {isInFullScreen ? <FullscreenExitRoundedIcon fontSize="large" /> : <FullscreenRoundedIcon fontSize="large" />}
        </IconButton>
        {/* </Tooltip> */}
      </Fab>
      {children}
    </Paper>
  </>;
}