import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Help, { Usage_Help } from './Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useBoolean, useCreation } from "ahooks";
import { Tooltip } from '@mui/material';
import style from './_index.module.scss';
import useId__utils from '@mui/utils/useId';
import useId__material from '@mui/material/utils/useId';
import { useId } from 'react';
import { commonUseSearchParams } from '@/pages/BCviz/const';
import CachedIcon from '@mui/icons-material/Cached';
import { useSearchParams } from 'react-router-dom';
import { datasetKey } from '../utils';
export default function Menu () {
  const navigate = useNavigate();
  const useDialogOpen = useBoolean(false);
  const [isOpen, { setTrue }] = useDialogOpen;
  const [searchParams] = useSearchParams();
  const isSearchParam_has_dataset = useCreation(() => searchParams.has(datasetKey), [searchParams]);
  const ids = [useId__utils(), useId__material(), useId()];
  return <><SpeedDial
    ariaLabel="hjx"
    // sx={{ position: 'absolute', bottom: 16, right: 16 }}
    icon={<SpeedDialIcon />}
    className={style['absolute'] ?? ""}
    direction='right'
    title='Menu'
  >

    <SpeedDialAction
      key={ids[0]}
      icon={
        <Tooltip title='Back to previous page' arrow>
          <ArrowBackIcon fontSize='large' />
        </Tooltip>}
      onClick={() => {
        navigate(-1);
      }}
    // tooltipOpen
    // tooltipTitle='Back'
    />
    <SpeedDialAction
      key={ids[1]}
      icon={<Tooltip title={Usage_Help} arrow>
        <HelpOutlineIcon fontSize='large' />
      </Tooltip>}
      onClick={() => {
        setTrue();
      }}
    // tooltipOpen
    // tooltipTitle='Help'
    />
    {isSearchParam_has_dataset ? <SpeedDialAction
      key={ids[2]}
      icon={<Tooltip title='Reload this page' arrow>
        <CachedIcon fontSize='large' />
      </Tooltip>}
      onClick={() => {
        navigate({
          // hash: '#',
          // search: '?'
        }, commonUseSearchParams);
      }}
    // tooltipOpen
    // tooltipTitle='Help'
    /> : null}


  </SpeedDial>
    <Help useDialogOpen={useDialogOpen} />
  </>;
}