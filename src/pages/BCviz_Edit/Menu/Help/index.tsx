import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useBoolean } from "ahooks";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
export const Usage_Help = 'Usage Help';
import style from './_index.module.scss';
export default function Help ({ useDialogOpen }: {
  readonly useDialogOpen: ReturnType<typeof useBoolean>;
}) {
  const [isOpen, { setTrue, setFalse }] = useDialogOpen;
  return <>
    <Dialog open={isOpen}
      onClose={setFalse}
      // fullScreen
      fullWidth
      autoFocus
    >
      <DialogTitle>
        <h1 className={style['title']}>{Usage_Help}</h1>
      </DialogTitle>
      <DialogContent>
        <ol>
          <li><DialogContentText>
            <p>Click vertices on U and V to create an edge between them.</p>
          </DialogContentText></li>
          <li>
            <DialogContentText>
              <p>Double-click an edge to delete it.</p>
            </DialogContentText>
          </li>
        </ol>


      </DialogContent>
      <DialogActions
      >
        <Button
          size='large' variant="contained"
          fullWidth
          autoFocus
          onClick={setFalse}
          startIcon={<CheckCircleOutlineIcon fontSize="large" />}
        // endIcon={<CheckCircleOutlineIcon fontSize="large" />}
        >I Know</Button>
      </DialogActions>
    </Dialog>

  </>;
}