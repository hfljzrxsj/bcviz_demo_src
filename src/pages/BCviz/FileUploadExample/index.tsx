import {
  Paper, Button, Tooltip, Link,
  Popover,//TODO:使用Menu替代
  List, ListItem, ListItemButton, // -> MenuList、MenuItem

} from "@mui/material";
import type { defaultTxt } from "../FileUploadSimple";
import style from './_index.module.scss';
import { useResetState } from "ahooks";

export default function FileUploadExample (props: {
  readonly defaultTxt: defaultTxt;
  readonly chooseExample: (url: string) => void;
}) {
  const { defaultTxt, chooseExample } = props;
  const [anchorEl, setAnchorEl, resetAnchorEl] = useResetState<HTMLButtonElement | null>(null);
  return <Paper elevation={24} className={style['examples'] ?? ''}>
    <Tooltip title="No suitable data? Click here to try these." arrow><Button
      size="large"
      fullWidth
      onClick={(e) => {
        setAnchorEl(e.currentTarget);
      }}
    >{'> '}<Link component="button">Examples</Link></Button></Tooltip>
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl}
      onClose={() => {
        resetAnchorEl();
      }}
    >
      <List>
        {defaultTxt.map((txt, ind) =>
        (
          <Tooltip arrow
            title={`Example ${ind + 1}`}
            key={txt}
            placement="right"
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  chooseExample(txt);
                  resetAnchorEl();
                }}
                key={txt}

              >
                {/* <Button
                size='large'
                // variant="contained"
              > */}
                <Link component="button" underline="hover">
                  {/* Example {ind + 1} */}
                  {txt}
                </Link>
                {/* </Button> */}
              </ListItemButton>
            </ListItem>

          </Tooltip>
        ))}</List></Popover>
  </Paper>;
}