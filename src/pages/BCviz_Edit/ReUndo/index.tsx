import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { Fab, IconButton, Tooltip } from '@mui/material';
import type { UseGraghDataHistoryTravel } from '..';
import style from './_index.module.scss';
import { useId } from 'react';
// import { } from 'ahooks';
export default function ReUndo ({ graghDataHistoryTravel: {
  forward,
  forwardLength,
  back,
  backLength,
} }: {
  readonly graghDataHistoryTravel: UseGraghDataHistoryTravel;
}) {
  return <div className={style['box']}>
    <Fab
      key={useId()}
      // color={backLength ? 'primary' : 'default'}
      size='large'
      onClick={back}
      disabled={!backLength}
      title='Undo'
    ><Tooltip title='Undo' arrow placement='right'>
        <IconButton size='large'
          disabled={!backLength}
          color={backLength ? 'info' : 'default'}
        >
          <UndoIcon fontSize='large' color={backLength ? 'primary' : 'disabled'} />
        </IconButton>
      </Tooltip></Fab>
    <Fab
      key={useId()}
      // color={forwardLength ? 'primary' : 'default'}
      size='large'
      onClick={forward}
      disabled={!forwardLength}
      title='Redo'
    ><Tooltip title='Redo' arrow placement='right'>
        <IconButton size='large' disabled={!forwardLength}
          color={forwardLength ? 'info' : 'default'}
        >
          <RedoIcon fontSize='large' color={forwardLength ? 'primary' : 'disabled'} />
        </IconButton>
      </Tooltip></Fab>
  </div>;
}