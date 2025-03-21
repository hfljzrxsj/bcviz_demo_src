import { TextField } from "@mui/material";
import { StrictMode } from "react";
import style from './_index.module.scss';

export default function SearchInput (props: {
  readonly run: (e?: number) => void;
}) {
  const { run, ...others } = props;
  return <StrictMode>
    <TextField
      className={style['SearchInput'] ?? ''}
      label="ID 查询"
      type="search"
      onChange={e => {
        run(Number(e.target.value.trim()));
      }}
      {...others}
    />
  </StrictMode>;
}