import { Button } from "@mui/material";
import { Box } from "@mui/system";
import classNames from "clsx";
import type { HTMLAttributes, MouseEventHandler } from "react";
import style from './_index.module.scss';
import { getHighlightLevelFromObj, type PosDataObj } from "../utils";

export default function TableCell (props: {
  readonly texts: ReadonlyArray<string | number>;
  readonly dotData?: PosDataObj;
  // readonly onDoubleClick?: MouseEventHandler<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>) {
  const { texts, dotData, ...others } = props;
  return <Box
    // elevation={24}
    className={classNames(style['table-cell'], style[getHighlightLevelFromObj(dotData)]
    ) ?? ''}
    // for={k}
    {...others}
  >{
      texts.map(text => <Button className={style['table-cell-Button'] ?? ''}
        variant='outlined'
        key={text}
      >{text}</Button>)
    }
  </Box>;
}