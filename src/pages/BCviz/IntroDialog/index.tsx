import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Dialog, Tooltip } from "@mui/material";
import { useBoolean } from "ahooks";
import style from './_index.module.scss';

const texts = ['双击折线图或二部图上的点可画直线', '单击折线图或二部图上的点可高亮'];
//\f\r\n\t\v
//\A
const tooltipText = texts.map((text, ind) => (`${ind + 1}.\t${text}`)).join('\t\r\n');
export default function IntroDialog () {
  const [isOpen, {
    setTrue,
    setFalse,
  }] = useBoolean(false);
  return (<>
    <Tooltip arrow title={tooltipText}>
      <Button
        variant="contained"
        onClick={setTrue}
        fullWidth
      // title={tooltipText}
      >
        使用帮助
      </Button>
    </Tooltip>
    <Dialog
      open={isOpen}
      // onOpen={setTrue}
      onClose={setFalse}
    // anchor="top"
    // disableSwipeToOpen={false}
    >
      <DialogTitle className={style['align-center'] ?? ''}>
        使用帮助
      </DialogTitle>
      <DialogContent className={style['Paper'] ?? ''}>
        <Paper elevation={24} >
          <h3 className={style['title-h']}>打开“交互模式”后，可进行以下操作</h3>
          <ol className={style['ul']}>
            {texts.map((i, ind) => <li
              key={ind}
            >{i}</li>)}
          </ol>
        </Paper>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained"
          onClick={setFalse}
          fullWidth>我知道了</Button>
      </DialogActions>

    </Dialog>
  </>);
}