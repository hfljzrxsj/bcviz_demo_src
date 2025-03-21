// import { clickLineVal } from "..";
import style from '../_index.module.scss';
import clsx from 'clsx';
import type { MouseEventHandler, SVGAttributes } from "react";
import { marginSize } from "../utils";
import type { PosDataObj } from '../types';

export default function HoverXLine (props: {
  readonly isEditX: boolean;
  readonly xEnd: number;
  readonly onClick?: MouseEventHandler<SVGLineElement>;
  readonly dotData: Pick<PosDataObj, 'v' | 'y'>;
  readonly className?: SVGAttributes<SVGLineElement>['className'];
}) {
  const { isEditX, xEnd, onClick = () => { }, dotData: { y, v }, className = '' } = props;
  if (isEditX) {
    return <>
      < line x1={marginSize} x2={xEnd} y1={y} y2={y}
        className={clsx(style['hover-x'],
          className
          // {
          // [style['hover-click-line'] ?? '']: v === clickLineVal
          // }
        )
        }
        onClick={onClick}
      ></line >
    </>;
  }
  return null;
}