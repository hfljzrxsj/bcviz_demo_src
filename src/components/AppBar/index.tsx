import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, FormControlLabel, IconButton, Popover, Switch, type AppBarProps } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import style from './_index.module.scss';
import { enumAppBarTitle, useAppBarTitleTypedSelector } from '@/store/AppBarTitleRuducer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StrictMode, useCallback, useContext, useState, type Dispatch } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useParams } from 'react-router';
import * as classNames from 'classnames';
import { documentTitle } from '@/pages/Overview';
import Menu from '../Menu';
import { MediaQueryContext } from '@/App';
import { enumActionName as DBEnumActionName, enumDB, useDBTypedSelector, type DBAction } from "@/store/DBReducer";
import { useDispatch } from 'react-redux';
import { db } from '@/pages/WebSQL';
import { enumActionName, enumSeverity, enumSnackbarAlert, type snackbarAlertAction } from '@/store/SnackBarRuducer';
import { waitLastEventLoop } from '@/utils';
import { useMount } from 'ahooks';
import copy from 'copy-text-to-clipboard';
// import clipboard from 'clipboardy';
const { error } = console;
interface ButtonAppBarProps extends AppBarProps {
  setMenuToggle: () => void;
}
export const StyledButton = ({ ...props }) => <Button
  variant="contained"
  size="large"
  {...props} />;
const clearCache = () => window.caches?.keys()?.then(e => e.forEach(cacheName => window.caches?.delete(cacheName))).catch(console.error);
export const CommonDialog = (props: {
  readonly open: boolean;
  readonly handleClose: () => void;
  readonly onClick: () => void;
  readonly title: string;
  readonly content?: string;
}) => {
  const { open = false, handleClose, onClick, title, content } = props;
  return <Dialog
    open={open}
    keepMounted
    onClose={handleClose}
  >
    <DialogTitle>{title}</DialogTitle>
    {content && <DialogContent>{content}</DialogContent>}
    <DialogActions className={style['DialogActions'] ?? ''}>
      <Button
        variant='outlined'
        onClick={handleClose}
        size='large'
      >取消</Button>
      <StyledButton onClick={onClick}>确定</StyledButton>
    </DialogActions>
  </Dialog>;
};
// const copy = ((e: string) => { var o = document.createElement("textarea"); o.value = e, document.body.append(o), o.select(), document.execCommand("copy"), o.remove(); });
const runSQL = (id: string, snackbarAlertDispatch: Dispatch<snackbarAlertAction>, text: string) => {
  let timeId = setTimeout(() => {
    waitLastEventLoop(() => location.reload());
  }, 5e3);
  fetch(`${import.meta.env.VITE_sqlFolder}/${id}.sql`).then(e => e.text()).then(s => {
    const arr = s.trim().split(';');
    db.transaction(tx => {
      for (let i of arr) {
        if (i) {
          tx.executeSql(i + ';', []);
          // if (i.toUpperCase().startsWith('DROP TRIGGER')) {
          // }
        }
      }
    }, (e) => {
      console.log(e);
      snackbarAlertDispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `执行失败, 原因：${e.message}`, [enumSnackbarAlert.severity]: enumSeverity.error } });
      clearTimeout(timeId);
    }, () => {
      snackbarAlertDispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: text, [enumSnackbarAlert.severity]: enumSeverity.success } });
    });
  });
};
const copyFetch = (dispatch: Dispatch<DBAction>) => fetch(`${import.meta.env.VITE_sqlFolder}/${import.meta.env.VITE_TRIGGER}.sql`).then(e => e.text()).then(t => {
  dispatch({
    type: DBEnumActionName.SET,
    payload: {
      'TRIGGER': t,
    },
  });
  return t ?? '';
}).then(copy
  // e => {
  // clipboard.write(e);
  // copy(e);
  // }
  , error).catch(error);
export default function ButtonAppBar (props: ButtonAppBarProps) {
  const dispatch = useDispatch<Dispatch<DBAction>>();
  const snackbarAlertDispatch = useDispatch<Dispatch<snackbarAlertAction>>();
  const { index, config, TRIGGER } = useDBTypedSelector(state => ({
    index: state.DB[enumDB.index],
    config: state.DB[enumDB.config],
    TRIGGER: state.DB[enumDB.TRIGGER]
  }));
  const copyAction = useCallback(() => {
    if (!TRIGGER)
      return copyFetch(dispatch);
    else {
      copy(TRIGGER);
      return Promise.resolve();
    };
  }, [TRIGGER, dispatch]);
  useMount(() => {
    waitLastEventLoop(copyAction);
  });
  const title = useAppBarTitleTypedSelector(state => state.AppBarTitle[enumAppBarTitle.title]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const PopoverOpen = Boolean(anchorEl);
  const { setMenuToggle, ...others } = props;
  const matches = useContext(MediaQueryContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { subtitle, id } = useParams();
  return (
    <StrictMode>
      <AppBar
        position="sticky"
        className={style['AppBar'] ?? ''}
        {...others}>
        <IconButton onClick={matches ? setMenuToggle : setMenuOpen.bind(null, true)} className={style['menuIcon'] ?? ''} size='large'>
          <MenuIcon />
        </IconButton>
        <span
          onClick={() => {
            copyAction().then(() => {
              const s = prompt('运行单条SQL代码');
              const sTrim = s?.trim();
              if (sTrim) {
                db.transaction(tx => {
                  tx.executeSql(sTrim, []);
                }, (e) => {
                  console.log(e);
                  snackbarAlertDispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `执行失败, 原因：${e.message}`, [enumSnackbarAlert.severity]: enumSeverity.error } });
                }, () => {
                  snackbarAlertDispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `${sTrim}\n执行成功`, [enumSnackbarAlert.severity]: enumSeverity.success } });
                });
              }
            });
          }}
        >{(title || id) ?? documentTitle}</span>
        <Button className={classNames(style['Avatar'], { [style['open'] ?? '']: PopoverOpen })}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <AccountCircleIcon />
          <span>{localStorage.getItem('HJX') ?? 'HJX, HJX'}</span>
          <KeyboardArrowDownIcon />
        </Button>
      </AppBar>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={PopoverOpen}
        onClose={() => {
          setAnchorEl(null);
        }}
        className={style['Popover'] ?? ''}
      >
        {/* <p>用户等级：<span>{getLevel()}</span></p>
        <p>用户权限：<span>{localStorage.getItem(regionName) ?? getLocalStorageFromJSON(orgId)}</span></p> */}
        {subtitle === config?.[0]?.path && <FormControlLabel control={<Switch />} label="索引"
          onChange={(_e, c) => {
            dispatch({
              type: DBEnumActionName.SET,
              payload: {
                index: c
              }
            });
          }}
          checked={index ?? false}
        />}
        {id && <StyledButton
          fullWidth
          onClick={() =>
            unstable_batchedUpdates(() => {
              setAnchorEl(null);
              setOpen(true);
            })
          }
        // startIcon={< LogoutIcon />}
        >
          重置{id}表
        </StyledButton>}
        <Button
          fullWidth
          onClick={() => {
            if (confirm('确定要删库跑路吗？')) {
              clearCache();
              localStorage.clear();
              config?.map(i => i.children).flat().forEach(id => {
                runSQL(id, snackbarAlertDispatch, `删${id}库跑路成功! 5秒后自动刷新`);
              });
            }
            handleClose();
          }
          }
          // startIcon={< LogoutIcon />}
          color='error'
          variant='outlined'
        >
          删库跑路
        </Button>
      </Popover>
      <CommonDialog
        open={open}
        handleClose={handleClose}
        title={`确定要重置${id}表吗？`}
        onClick={() => {
          runSQL(id ?? '', snackbarAlertDispatch, `重置${id}表成功! 5秒后自动刷新`);
          handleClose();
          // navigate(concatUrl(pathString.login));
        }}
      />
      <Drawer
        anchor='left'
        open={!matches && menuOpen}
        onClose={setMenuOpen.bind(null, false)}>
        <Menu />
      </Drawer>
    </StrictMode>
  );
}
