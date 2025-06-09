import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { Fab, IconButton, Tooltip, type SvgIconTypeMap } from '@mui/material';
import type { UseGraghDataHistoryTravel } from '..';
import style from './_index.module.scss';
import { useId, type MouseEventHandler } from 'react';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
// import { } from 'ahooks';
const RedoUndoFab = ({ onClick, isAbled, Icon }: {
  readonly onClick: MouseEventHandler<HTMLButtonElement>;
  readonly isAbled: boolean;
  readonly Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}) => {
  const isDisabled = !isAbled;
  return <Fab
    // key={useId()}
    // color={backLength ? 'primary' : 'default'}
    size='large'
    onClick={onClick}
    disabled={isDisabled}
    title='Undo'
  ><Tooltip title='Undo' arrow placement='right'>
      <IconButton size='large'
        disabled={isDisabled}
        color={isAbled ? 'info' : 'default'}
      >
        <Icon fontSize='large' color={isAbled ? 'primary' : 'disabled'} />
      </IconButton>
    </Tooltip></Fab>;
};
export default function ReUndo ({ graghDataHistoryTravel: {
  forward,
  forwardLength,
  back,
  backLength,
} }: {
  readonly graghDataHistoryTravel: UseGraghDataHistoryTravel;
}) {
  return <div className={style['box']}>
    <RedoUndoFab onClick={back}
      isAbled={Boolean(backLength)}
      key={useId()}
      Icon={UndoIcon}
    />
    <RedoUndoFab onClick={forward}
      isAbled={Boolean(forwardLength)}
      key={useId()}
      Icon={RedoIcon}
    />
  </div>;
}