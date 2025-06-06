import { Modal, CircularProgress } from "@mui/material";
import style from "./_index.module.scss";

export default function Loading (props: {
  readonly open: boolean;
}) {
  const { open } = props;
  return <Modal open={open} className={style['Modal'] ?? ''}><CircularProgress className={style['CircularProgress'] ?? ''} /></Modal>;
}