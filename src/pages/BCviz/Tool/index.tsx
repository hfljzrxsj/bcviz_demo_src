import { Paper, Button, FormControlLabel, Checkbox } from "@mui/material";
import FileUpload, { type FileUploadProps } from "../FileUpload";
import style from './_index.module.scss';
import type { Actions } from 'ahooks/lib/useBoolean';
import classNames from "clsx";
import { useLocation } from "react-router";
import { path } from "@/pages/BCViz_new";
import type { SetStateType } from "../types";
import { Modes } from "@/pages/BCViz_new/utils";

export interface SelectProps {
  selectMode: Modes,
  setSelectMode: SetStateType<Modes>;
}

export default function Tool (props: {
  // readonly setTableData: SetStateType<OriginDataObjArr | undefined>,
  // readonly setGraphData: SetStateType<OriginGraphDataArr | undefined>,
  readonly toggleIsEditX?: Actions["toggle"],
  readonly isEditX?: boolean;
  readonly className?: string | undefined;
} & FileUploadProps) {
  const {
    // setTableData, setGraphData,
    toggleIsEditX = () => { }, isEditX, className,
    setDatas, setFileNames,

  } = props;
  const { pathname } = useLocation();

  return <Paper elevation={24}
    className={classNames(style['Tool'], className)}
  >
    <FileUpload
      // setTableData={setTableData}
      // setGraphData={setGraphData}
      {...{ setDatas, setFileNames }}
    />
    {pathname === path.old ? <Button
      variant="outlined"
      className={style['x-line-mode'] ?? ''}
      fullWidth
    ><FormControlLabel
        className={style['x-line-mode-label'] ?? ''}
        onChange={toggleIsEditX}
        control={<Checkbox checked={isEditX} />}
        label="Edit Mode"
      /></Button> : null}


    {/* <IntroDialog /> */}
  </Paper>;
}