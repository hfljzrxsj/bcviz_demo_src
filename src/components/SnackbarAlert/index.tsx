import { MediaQueryContext } from '@/App';
import { enumActionName, useSnackBarTypedSelector, type snackbarAlertAction } from '@/store/SnackBarRuducer';
import { Alert, Snackbar } from '@mui/material';
import { StrictMode, useContext, type Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import style from './_index.module.scss';
export default function CustomizedSnackbars () {
  const { open, alertText, severity } = useSnackBarTypedSelector(state => ({
    open: state.SnackBar.open,
    alertText: state.SnackBar.alertText,
    severity: state.SnackBar.severity,
  }));
  const dispatch = useDispatch<Dispatch<snackbarAlertAction>>();
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: enumActionName.OPENFALSE });
  };
  const matches = useContext(MediaQueryContext);
  const showText = matches ? alertText : alertText.split('/').pop();
  return (
    <StrictMode>
      <Snackbar open={Boolean(open && alertText)}
        onClose={handleClose}
        message={showText}
        className={style['Snackbar'] ?? ""}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
        >{showText}</Alert >
      </Snackbar>
    </StrictMode>
  );
}
