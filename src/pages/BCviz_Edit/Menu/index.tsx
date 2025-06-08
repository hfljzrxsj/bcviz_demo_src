import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Help, { Usage_Help } from './Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useBoolean } from "ahooks";
import { Tooltip } from '@mui/material';
import style from './_index.module.scss';
export default function Menu () {
  const navigate = useNavigate();
  const useDialogOpen = useBoolean(false);
  const [isOpen, { setTrue, setFalse }] = useDialogOpen;
  return <><SpeedDial
    ariaLabel="hjx"
    // sx={{ position: 'absolute', bottom: 16, right: 16 }}
    icon={<SpeedDialIcon />}
    className={style['absolute'] ?? ""}
    direction='right'
  >

    <SpeedDialAction
      key={0}
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
      key={1}
      icon={<Tooltip title={Usage_Help} arrow>
        <HelpOutlineIcon fontSize='large' />
      </Tooltip>}
      onClick={() => {
        setTrue();
      }}
    // tooltipOpen
    // tooltipTitle='Help'
    />
  </SpeedDial>
    <Help useDialogOpen={useDialogOpen} />
  </>;
}