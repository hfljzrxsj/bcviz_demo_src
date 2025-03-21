import ButtonAppBar from "@/components/AppBar";
import Menu from "@/components/Menu";
import { Collapse, Paper } from "@mui/material";
import { useBoolean } from "ahooks";
import { StrictMode, useContext, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import style from './_index.module.scss';
import { MediaQueryContext } from "@/App";
export default function MainFrame () {
  const [menuOpen, { toggle: setMenuOpen }] = useBoolean(true);
  // useMount(() => {
  //   // testLogin().then(e => {
  //   //   if (!e) {
  //   //     navigate(pathString.login);
  //   //   }
  //   // });
  //   if (!localStorage.getItem(Authorization)) navigate(pathString.login);
  // });
  const matches = useContext(MediaQueryContext);
  return (
    <StrictMode>
      <ButtonAppBar setMenuToggle={setMenuOpen} />
      <div className={style["MainFrame"]} style={{ '--gap': menuOpen ? '9q' : 0 } as CSSProperties}>
        <Collapse in={menuOpen && matches} orientation='horizontal'>
          <Paper elevation={24}>
            <Menu />
          </Paper>
        </Collapse>
        <div><Outlet /></div>
      </div>
    </StrictMode>
  );
}