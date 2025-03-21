import { StrictMode, useState, type Dispatch } from "react";
import { Collapse, type ListItemButtonProps, List, Divider, ListItemButton, ListItemText, StyledEngineProvider, Backdrop, CircularProgress, } from '@mui/material';
import { concatUrl, menuItems } from "@/Route";
import { NavLink, type RouteObject } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/ExpandMore';
import style from './_index.module.scss';
import * as classnames from 'classnames';
import { unstable_batchedUpdates } from "react-dom";
import { useDispatch } from "react-redux";
import { enumActionName as AppBarEnumActionName, type AppBarTitleAction } from "@/store/AppBarTitleRuducer";
import { useRequest } from "ahooks";
import axios from "axios";
import { commonUseRequestParams } from "@/utils/const";
import { enumActionName as DBEnumActionName, type DBAction } from "@/store/DBReducer";
const StyledListItemButton = ({ className, ...props }: ListItemButtonProps) => <ListItemButton
  className={classnames(className, style['ListItemButton'])}
  {...props}
/>;
interface StyledNavLinkProps extends ListItemButtonProps {
  readonly text: string;
  readonly path: string;
  readonly setOpen?: () => void;
}
const StyledNavLink = (props: StyledNavLinkProps) => {
  const { text = '', path = '', setOpen, ...others } = props;
  const [isSelected, setIsSelected] = useState(false);
  const [first, setFirst] = useState(true);
  const dispatch = useDispatch<Dispatch<AppBarTitleAction>>();
  return (
    <StyledListItemButton
      selected={isSelected}
      disableGutters
      onClick={(e) => {
        const { target } = e;
        if (HTMLDivElement.prototype.isPrototypeOf(target) && target instanceof HTMLDivElement && Object.prototype.toString.call(target) === '[object HTMLDivElement]' && target.constructor === HTMLDivElement && typeof target === 'object') {
          const { children, childNodes } = target;
          const a = children.item(0) ?? children[0] ?? childNodes[0] ?? childNodes.values().next().value ?? document.createElement('a');
          if (HTMLAnchorElement.prototype.isPrototypeOf(a) && a instanceof HTMLAnchorElement && Object.prototype.toString.call(a) === '[object HTMLAnchorElement]' && a.constructor === HTMLAnchorElement && typeof a === 'object')
            a.click();
        }
      }}
      {...others}>
      <NavLink
        to={path}
        className={({ isActive }) => unstable_batchedUpdates(() => {
          setIsSelected(isActive);
          if (isActive && first) {
            setOpen?.();
          }
          setFirst(false);
          return style['NavLink'];
        })}
        onClick={() => {
          dispatch({ type: AppBarEnumActionName.SET_TITLE, payload: { title: text } });
          document.title = text;
          // redirect(path);
          // waitLastEventLoop(() => location.reload());
        }}
      >
        {/* <ListItemIcon> */}
        {/* </ListItemIcon> */}
        {text}
        {/* <ListItemText primary={text} /> */}
      </NavLink>
    </StyledListItemButton>
  );
};
const StyledCollase = ({ item }: { readonly item: RouteObject; }) => {
  const { children, id, path = '' } = item;
  const [open, setOpen] = useState(false);
  return (
    <StrictMode>
      <StyledListItemButton onClick={setOpen.bind(null, !open)}
        className={classnames(style['CollapseClick'], { [style['CollapseClickActive'] ?? '']: open })}>
        <ListItemText primary={id} />
        {/* <ListItemIcon> */}
        <KeyboardArrowDownIcon className={classnames({ [style['ArrowDownIcon'] ?? '']: open })} />
        {/* </ListItemIcon> */}
      </StyledListItemButton>
      <Collapse in={open}>
        <ul>
          {children?.map((child, index) => (
            <li key={index}>
              <StyledNavLink
                text={child.id ?? ''}
                path={concatUrl(path, child.path ?? '')}
                setOpen={setOpen.bind(null, true)}
              />
            </li>
          )
          )}</ul>
      </Collapse>
    </StrictMode>
  );
};
export type DBConfigData = ReadonlyArray<{
  readonly path: RouteObject['path'];
  readonly children: ReadonlyArray<string>;
}>;
export default function Menu () {
  const dispatch = useDispatch<Dispatch<DBAction>>();
  const { data, loading } = useRequest(() => axios.get<DBConfigData>(import.meta.env.VITE_configFile).then(e => {
    const { data } = e;
    dispatch({
      type: DBEnumActionName.SET,
      payload: {
        config: data
      }
    });
    return data;
  }).catch(console.error), commonUseRequestParams);
  if (loading || !data)
    return <Backdrop open><CircularProgress /></Backdrop>;
  const dbData = data.map(i => ({
    id: i.path,
    path: i.path,
    children: i.children.map(i => ({
      path: i,
      id: i
    }))
  }));
  return (
    <StrictMode>
      <StyledEngineProvider injectFirst>
        {
          [...menuItems, ...dbData].map((item, index) => {
            const { children, id = '', path = '' } = item;
            return (
              <StrictMode>
                <List key={index}>
                  {children ? (
                    <StyledCollase
                      item={item} />
                  ) : (
                    <StyledNavLink
                      text={id}
                      path={concatUrl(path)}
                      className={style['overview'] ?? ''}
                    />
                  )}
                </List>
                <Divider />
              </StrictMode>
            );
          })
        }
      </StyledEngineProvider>
    </StrictMode>
  );
}