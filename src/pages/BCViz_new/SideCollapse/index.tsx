import {
  Paper,  // Tabs,
  Collapse,
  IconButton,
  Tooltip,

} from "@mui/material";
import style from './_index.module.scss';
import { useBoolean } from 'ahooks';
import clsx from "clsx";
import {
  type ReactPortal, type ProviderProps, Fragment, StrictMode, type SuspenseProps,
  type ProfilerProps, type PropsWithChildren, type DOMAttributes,
  type JSX,
  type CSSProperties
} from "react";
import { waitLastEventLoop } from "@/utils";
import { dispatchEvent, resizeEvent } from '../CommonECharts';
const rotates = ['225deg', '45deg'];
export default function SideCollapse (props:
  (
    Pick<ReactPortal, 'children'> &
    Pick<ProviderProps<unknown>, 'children'> &
    Parameters<typeof Fragment>[0] &
    Parameters<typeof StrictMode>[0] &
    Pick<SuspenseProps, 'children'> &
    Pick<ProfilerProps, 'children'> &
    PropsWithChildren &
    Pick<DOMAttributes<unknown>, 'children'> &
    JSX.ElementChildrenAttribute
  ) &
  // { children: null; } &
  {
    readonly buttonOrder?: number;
    readonly isOpen?: boolean;
  }
) {
  const { buttonOrder = 0, isOpen: isOpenFromProps = true, children, ...others } = props;
  const [isOpen, { toggle }] = useBoolean(isOpenFromProps);
  if (!children) {
    return null;
  }

  return <Paper className={style['Main-Side'] ?? ''} elevation={24} {...others}>
    <Tooltip title={`${isOpen ? 'collapse' : 'expand'} toolbar`} arrow>
      <IconButton size="large"
        className={style['IconButton'] ?? ''}
        onClick={() => {
          toggle();
          waitLastEventLoop(() => {
            dispatchEvent(resizeEvent);
          });
        }}
        style={{ '--order': buttonOrder, '--initRotate': rotates[buttonOrder], '--clickRotate': rotates[1 - buttonOrder] } as CSSProperties}
      ><div className={clsx(style['triangle'],
        { [style['rotate'] ?? '']: isOpen })
      }></div></IconButton>
    </Tooltip>
    <Collapse in={isOpen}
      orientation="horizontal"

    >
      {children}
    </Collapse>

  </Paper>;
}