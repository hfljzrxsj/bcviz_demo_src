import { Link, Paper } from "@mui/material";
import { isChina } from "../getIntl";
import style from './_index.module.scss';
import { useRef } from "react";
import { useEventListener, useLocalStorageState } from "ahooks";
import { MouseEventListenerNames, isLeftMouseEvent, useMouseEventListenerOption } from "../hooks/useGestureFullScreen.mjs";
const { MAX_SAFE_INTEGER } = Number;
export default function BeiAnHao () {
  const ref = useRef<HTMLDivElement>(null);
  const [isNotShowBeian, setIsNotShowBeian] = useLocalStorageState<string>('beian');
  useEventListener(MouseEventListenerNames, (e: Event) => {
    if (isLeftMouseEvent(e)) {
      return;
    }
    setIsNotShowBeian('1');
    e.preventDefault();
  }, useMouseEventListenerOption(ref.current));
  return (!isNotShowBeian && isChina) ?
    <div className={style['beian'] ?? ''}
      style={{ zIndex: MAX_SAFE_INTEGER }}
    >
      <h1
        className={style['beian-h1']}
        ref={ref}
      ><Link href="http://beian.miit.gov.cn" underline="hover" target="_blank"
        className={style['beian-h1-Link'] ?? ''}
      >桂ICP备2025060391号-1</Link>
      </h1>
    </div>
    : null;
}