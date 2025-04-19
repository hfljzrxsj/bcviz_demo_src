import { Autocomplete, Paper, Tooltip, styled, type TooltipProps, tooltipClasses } from "@mui/material";
import { arrayLengthBigThanNum, getDotName } from "../utils";
import AutocompleteRenderInput from "../AutoCompleteRenderInput";
import AutoCompleteRenderOptionMenuItem from "../AutoCompleteRenderOption";
import type { VisualMapSection, VisualMapSectionSingle } from "@/pages/BCviz/utils";
import type { PosDataObjArr, SetStateType } from "@/pages/BCviz/types";
import styleBCvizNew from '../_index.module.scss';
import style from './_index.module.scss';
import type { CSSProperties } from "react";

const { isArray } = Array;
type VisualMapSectionMutilOrSingle = VisualMapSection | VisualMapSectionSingle;
const isVisualMapSectionFunc = (v: VisualMapSectionMutilOrSingle): v is VisualMapSection => {
  return isArray(v);
};
const showText = ({ start, end }: VisualMapSectionSingle, dataArrWithPos: PosDataObjArr) => {
  const startObj = dataArrWithPos[start];
  const endObj = dataArrWithPos[end];
  if (!startObj || !endObj) {
    return '';
  }
  return `${[start, end].map(i => dataArrWithPos2ShowText(dataArrWithPos, i)).join(' ~ ')}`;
};

const dataArrWithPos2ShowText = (dataArrWithPos: PosDataObjArr, ind: number) => {
  const obj = dataArrWithPos[ind];
  if (!obj) {
    return '';
  }
  return getDotName(obj);
};
const showLabelFunc = (option: VisualMapSectionMutilOrSingle, dataArrWithPos: PosDataObjArr) => {
  return `${isVisualMapSectionFunc(option) ? 'Show All' : showText(option, dataArrWithPos)}`;

};
const getCount = ({ start, end }: VisualMapSectionSingle) => end - start + 1;
const TransparentTooltip = styled(({ className, ...props }:
  // {
  // readonly backgroundColor: CSSProperties['backgroundColor'];
  // } &
  TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: 'unset',
    // backgroundColor: 'transparent',
    // color: '#000',
    boxShadow: theme.shadows[24],
    // fontSize: 11,
  },
}));
export default function VisualMapSectionAutoComplete (props: {
  readonly visualMapSection: VisualMapSection | undefined;
  readonly selectShowItem: number;
  readonly setSelectShowItem: SetStateType<number>;
  readonly dataArrWithPos: PosDataObjArr;
}) {
  const { visualMapSection, setSelectShowItem, dataArrWithPos, selectShowItem } = props;
  if (!visualMapSection) {
    return null;
  }
  const visualMapSectionAutoCompleteOptions = [visualMapSection, ...visualMapSection];
  const value = visualMapSectionAutoCompleteOptions[selectShowItem];
  return (arrayLengthBigThanNum(visualMapSection.length, 2)) ?
    <Paper elevation={24} className={styleBCvizNew['Select'] ?? ''}><Autocomplete
      autoComplete
      autoCapitalize="words"
      autoFocus
      autoHighlight
      // autoSelect
      blurOnSelect
      clearOnBlur
      clearOnEscape
      fullWidth
      handleHomeEndKeys
      includeInputInList
      openOnFocus
      selectOnFocus
      disableClearable
      disableCloseOnSelect={false}
      disabledItemsFocusable={false}
      disableListWrap={false}
      disablePortal={false}
      filterSelectedOptions={false}
      freeSolo={false}
      options={visualMapSectionAutoCompleteOptions}
      getOptionLabel={option => showLabelFunc(option, dataArrWithPos)}
      defaultValue={visualMapSection}
      {...(value ? { value } : null)}
      // value={visualMapSectionAutoCompleteOptions[selectShowItem]}
      onChange={(e, v, r, d) => {
        if (v) {
          setSelectShowItem(visualMapSectionAutoCompleteOptions.indexOf(v));
        } else {
          setSelectShowItem(0);
        }
      }}
      renderInput={(params) => <AutocompleteRenderInput
        {...params}
        label='Select Subgraph'
        placeholder="Please Input Subgraph"
      />}
      renderOption={(props, option, state) => {
        const { autoFocus,
          tabIndex,
          className,
          // style,
          ...others } = props;
        const isVisualMapSection = isVisualMapSectionFunc(option);
        const { index } = state;
        return (
          <TransparentTooltip
            title={isVisualMapSection ?
              <Paper elevation={24} className={style['Tooltip-total'] ?? ''}>total: {option.length}</Paper> :
              <Paper elevation={24}
                className={style['Tooltip-count'] ?? ''}
                style={{ 'backgroundColor': option.color }}
              >
                {/* <Paper elevation={24} className={style['Tooltip-Paper-bg'] ?? ''}
                  
                ></Paper> */}
                <Paper elevation={24} className={style['Tooltip-count-text'] ?? ''}>count: {getCount(option)}</Paper>
              </Paper>}
            arrow
            placement="right"
            className={style['Tooltip'] ?? ''}
          // style={{ padding: 'unset' }}
          >
            <AutoCompleteRenderOptionMenuItem {...props} >
              {showLabelFunc(option, dataArrWithPos)}
            </AutoCompleteRenderOptionMenuItem>
          </TransparentTooltip>)
          ;
      }}
    />
    </Paper > : null;
}
/*
isVisualMapSection ? `total: ${option.length}` : <Paper elevation={24} style={{ 'backgroundColor': option.color }}>
            {`count: ${getCount(option)}`}
          </Paper>


          <AutoCompleteRenderOptionMenuItem {...props} >{
            //Rank ${index + 1}:
            //(${end - start + 1})
            showLabelFunc(option, dataArrWithPos)
          }</AutoCompleteRenderOptionMenuItem>
*/