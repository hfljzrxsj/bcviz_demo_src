import { Modal, CircularProgress } from "@mui/material";
import style from "./_index.module.scss";
// import type {
//   ReactPortal, Fragment, StrictMode, SuspenseProps, ProfilerProps, PropsWithChildren, DOMAttributes, ProviderProps, HTMLAttributes, JSX,
//   ReactElement, ComponentElement, FunctionComponentElement, FunctionComponent, Component, PureComponent, ExoticComponent, LazyExoticComponent, MemoExoticComponent, NamedExoticComponent, ProviderExoticComponent, ForwardRefExoticComponent
// } from "react";

export default function Loading (props: {
  readonly open: boolean;
}) {
  const { open } = props;
  return <Modal open={open} className={style['Modal'] ?? ''}><CircularProgress className={style['CircularProgress'] ?? ''} /></Modal>;
}