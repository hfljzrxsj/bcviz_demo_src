//@ts-ignore
import Ckeditor5CustomBuildSrcPlaceholder from 'ckeditor5-custom-build/src/Placeholder';
import * as CryptoJs from 'crypto-js';
import * as Echarts from 'echarts';
import EmotionStyled from '@emotion/styled';
import * as  HcaptchaReactHcaptcha from '@hcaptcha/react-hcaptcha';
import * as He from 'he';
import * as Juice from 'juice';
import * as LodashDebounce from 'lodash/debounce';
import * as Moment from 'moment';
import * as MomentMoment from 'moment/moment';
import MuiIconsMaterialAccountcircle from '@mui/icons-material/AccountCircle';
import MuiIconsMaterialAdd from '@mui/icons-material/Add';
import MuiIconsMaterialArrowdropdown from '@mui/icons-material/ArrowDropDown';
import MuiIconsMaterialCheck from '@mui/icons-material/Check';
import MuiIconsMaterialCheckbox from '@mui/icons-material/CheckBox';
import MuiIconsMaterialCheckboxoutlineblank from '@mui/icons-material/CheckBoxOutlineBlank';
import MuiIconsMaterialCheckcircleoutline from '@mui/icons-material/CheckCircleOutline';
import MuiIconsMaterialClear from '@mui/icons-material/Clear';
import MuiIconsMaterialClearoutlined from '@mui/icons-material/ClearOutlined';
import MuiIconsMaterialClose from '@mui/icons-material/Close';
import MuiIconsMaterialCloseoutlined from '@mui/icons-material/CloseOutlined';
import MuiIconsMaterialEditoutlined from '@mui/icons-material/EditOutlined';
import MuiIconsMaterialFilterlist from '@mui/icons-material/FilterList';
import MuiIconsMaterialHelp from '@mui/icons-material/Help';
import MuiIconsMaterialIndeterminatecheckbox from '@mui/icons-material/IndeterminateCheckBox';
import MuiIconsMaterialLoop from '@mui/icons-material/Loop';
import MuiIconsMaterialSavealt from '@mui/icons-material/SaveAlt';
import MuiIconsMaterialSearch from '@mui/icons-material/Search';
import MuiIconsMaterialSmarttoy from '@mui/icons-material/SmartToy';
import MuiIconsMaterialSyncalt from '@mui/icons-material/SyncAlt';
import MuiLabAdapterdatefns from '@mui/lab/AdapterDateFns';
import MuiLabDesktopdatepicker from '@mui/lab/DesktopDatePicker';
import MuiLabLoadingbutton from '@mui/lab/LoadingButton';
import MuiLabLocalizationprovider from '@mui/lab/LocalizationProvider';
import MuiLabTabcontext from '@mui/lab/TabContext';
import MuiLabTablist from '@mui/lab/TabList';
import MuiLabTabpanel from '@mui/lab/TabPanel';
import MuiMaterialAccordion from '@mui/material/Accordion';
import MuiMaterialAccordiondetails from '@mui/material/AccordionDetails';
import MuiMaterialAccordionsummary from '@mui/material/AccordionSummary';
import MuiMaterialAlert from '@mui/material/Alert';
import MuiMaterialBox from '@mui/material/Box';
import MuiMaterialBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiMaterialChip from '@mui/material/Chip';
import MuiMaterialCircularprogress from '@mui/material/CircularProgress';
import MuiMaterialCssbaseline from '@mui/material/CssBaseline';
import MuiMaterialDialog from '@mui/material/Dialog';
import MuiMaterialDialogactions from '@mui/material/DialogActions';
import MuiMaterialDialogcontent from '@mui/material/DialogContent';
import MuiMaterialDialogcontenttext from '@mui/material/DialogContentText';
import MuiMaterialDialogtitle from '@mui/material/DialogTitle';
import MuiMaterialDivider from '@mui/material/Divider';
import MuiMaterialDrawer from '@mui/material/Drawer';
import MuiMaterialFade from '@mui/material/Fade';
import MuiMaterialFormhelpertext from '@mui/material/FormHelperText';
import MuiMaterialGrid from '@mui/material/Grid';
import MuiMaterialIconbutton from '@mui/material/IconButton';
import MuiMaterialInput from '@mui/material/Input';
import MuiMaterialInputadornment from '@mui/material/InputAdornment';
import MuiMaterialInputbase from '@mui/material/InputBase';
import MuiMaterialInputlabel from '@mui/material/InputLabel';
import MuiMaterialLinearprogress from '@mui/material/LinearProgress';
import MuiMaterialLink from '@mui/material/Link';
import MuiMaterialList from '@mui/material/List';
import MuiMaterialListitem from '@mui/material/ListItem';
import MuiMaterialListitemtext from '@mui/material/ListItemText';
import MuiMaterialMenu from '@mui/material/Menu';
import MuiMaterialMenuitem from '@mui/material/MenuItem';
import MuiMaterialModal from '@mui/material/Modal';
import MuiMaterialOutlinedinput from '@mui/material/OutlinedInput';
import MuiMaterialPaper from '@mui/material/Paper';
import MuiMaterialPopover from '@mui/material/Popover';
import MuiMaterialPopper from '@mui/material/Popper';
import MuiMaterialSelect from '@mui/material/Select';
import MuiMaterialSelectSelectinput from '@mui/material/Select/SelectInput';
import MuiMaterialSlide from '@mui/material/Slide';
import MuiMaterialSnackbar from '@mui/material/Snackbar';
import MuiMaterialStack from '@mui/material/Stack';
import MuiMaterialStep from '@mui/material/Step';
import MuiMaterialStepper from '@mui/material/Stepper';
import MuiMaterialStylesCreatetheme from '@mui/material/styles/createTheme';
import MuiMaterialStylesShadows from '@mui/material/styles/shadows';
import MuiMaterialStylesStyled from '@mui/material/styles/styled';
import MuiMaterialStylesThemeprovider from '@mui/material/styles/ThemeProvider';
import MuiMaterialStylesZindex from '@mui/material/styles/zIndex';
import MuiMaterialTab from '@mui/material/Tab';
import MuiMaterialTable from '@mui/material/Table';
import MuiMaterialTablebody from '@mui/material/TableBody';
import MuiMaterialTablecontainer from '@mui/material/TableContainer';
import MuiMaterialTablehead from '@mui/material/TableHead';
import MuiMaterialTablerow from '@mui/material/TableRow';
import MuiMaterialTabs from '@mui/material/Tabs';
import MuiMaterialTextfield from '@mui/material/TextField';
import MuiMaterialTypography from '@mui/material/Typography';
import MuiMaterialUsemediaquery from '@mui/material/useMediaQuery';
import MuiMaterialUsescrolltrigger from '@mui/material/useScrollTrigger';
import * as  ReactDomServer from 'react-dom/server';
import ReactDraggable from 'react-draggable';
import ReduxThunk from 'redux-thunk';
import * as  Xlsx from 'xlsx';
import Ahooks, { useBoolean, useMount, useUpdateEffect, useWhyDidYouUpdate } from 'ahooks';
import AhooksLibUseexternal, { type Status } from 'ahooks/lib/useExternal';
import Axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Base64, { decode } from 'base-64';
import Ckeditor5CustomBuildBuildCkeditor, { defaultConfig } from 'ckeditor5-custom-build/build/ckeditor';
import Ckeditor5InlineBuild from 'ckeditor5-inline-build';
import CkeditorCkeditor5React, { CKEditor } from '@ckeditor/ckeditor5-react';
import DateFns, { eachDayOfInterval, format, max, parseISO, set, startOfWeek, sub } from 'date-fns';
import DateFnsLocale, { ca, is, tr } from 'date-fns/locale';
import EmotionReact, { ThemeProvider, css, useTheme } from '@emotion/react';
import History, { createHashHistory } from 'history';
import MaterialUiPopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import MaterialUiPopupStateHooks, { type PopupState } from 'material-ui-popup-state/hooks';
import MuiBase, { MultiSelectUnstyled, createFilterOptions } from '@mui/base';
import MuiBaseAutocompleteunstyled, { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import MuiIconsMaterial, { AddBox, BorderColor, CloseOutlined, CommentsDisabledOutlined, FamilyRestroomRounded, Flag, FlareSharp, Height, Label, Padding, SettingsOutlined, SpaRounded, TurnedIn } from '@mui/icons-material';
import MuiLab, { LoadingButton } from '@mui/lab';
import MuiMaterial, { Alert, AlertTitle, AppBar, type AppBarProps, Autocomplete, type AutocompleteProps, type AutocompleteValue, Backdrop, type BackdropProps, Box, type BoxProps, Breadcrumbs, Button, ButtonBase, type ButtonProps, CardActions, CardContent, Checkbox, Chip, CircularProgress, Collapse, Container, Dialog, DialogActions, DialogContent, Divider, Drawer, Fab, type FabProps, FormControl, FormControlLabel, type FormControlProps, FormGroup, FormHelperText, Grid, type GridProps, Icon, IconButton, InputAdornment, InputBase, InputLabel, LinearProgress, Link, List, ListItem, Menu, MenuItem, Modal, type ModalProps, OutlinedInput, Paper, Popover, type PopoverProps, Popper, Radio, RadioGroup, Select, type SelectChangeEvent, type SelectProps, Skeleton, Slider, Snackbar, type SnackbarCloseReason, type SnackbarProps, Stack, type StackProps, Step, type StepProps, Stepper, type StepperProps, SvgIcon, Switch, type SxProps, Tab, Table, TableCell, type TableCellProps, TableContainer, TableFooter, TableRow, TableSortLabel, Tabs, TextField, type TextFieldProps, ThemeProvider, Toolbar, Tooltip, Typography, type TypographyProps, buttonClasses, createTheme, debounce, fabClasses, styled, tabClasses, tableCellClasses, tooltipClasses, useMediaQuery, useStepContext } from '@mui/material';
import MuiMaterialAutocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import MuiMaterialButton from '@mui/material/Button';
import MuiMaterialCheckbox, { checkboxClasses } from '@mui/material/Checkbox';
import MuiMaterialColors, { grey } from '@mui/material/colors';
import MuiMaterialFormcontrol, { useFormControl } from '@mui/material/FormControl';
import MuiMaterialStepconnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import MuiMaterialStyles, { StyledEngineProvider, alpha, styled, useTheme, useThemeProps } from '@mui/material/styles';
import MuiMaterialTablecell from '@mui/material/TableCell';
import MuiMaterialTooltip from '@mui/material/Tooltip';
import MuiMaterialUtils, { unstable_useId, useControlled, useEventCallback } from '@mui/material/utils';
import MuiStyles, { makeStyles, styled } from '@mui/styles';
import MuiSystem, { Box, Stack, type StackProps, fontStyle, style, styled, width } from '@mui/system';
import MuiUtils, { unstable_composeClasses, visuallyHidden } from '@mui/utils';
import MuiXDataGrid, { DataGrid, gridPageCountSelector, gridPageSelector, gridPageSizeSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import MuiXDatePickers, { DatePicker, type DatePickerProps, DesktopDatePicker, type DesktopDatePickerProps, LocalizationProvider, MonthPicker, StaticDatePicker, YearPicker } from '@mui/x-date-pickers';
import MuiXDatePickersAdapterdatefns, { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MuiXDatePickersCalendarpickerPickerscalendarheaderclasses, { getPickersCalendarHeaderUtilityClass } from '@mui/x-date-pickers/CalendarPicker/pickersCalendarHeaderClasses';
import MuiXDatePickersCalendarpickerPickersfadetransitiongroup, { PickersFadeTransitionGroup } from '@mui/x-date-pickers/CalendarPicker/PickersFadeTransitionGroup';
import MuiXDatePickersCalendarpickerUsecalendarstate, { useCalendarState } from '@mui/x-date-pickers/CalendarPicker/useCalendarState';
import MuiXDatePickersDatepickerDatepickertoolbar, { DatePickerToolbar } from '@mui/x-date-pickers/DatePicker/DatePickerToolbar';
import * as MuiXDatePickersDesktopdatepicker from '@mui/x-date-pickers/DesktopDatePicker';
import MuiXDatePickersInternals, { DayPicker, defaultReduceAnimations, parseNonNullablePickerDate, useDefaultDates } from '@mui/x-date-pickers/internals';
import MuiXDatePickersInternalsComponentsPickersarrowswitcher, { PickersArrowSwitcher } from '@mui/x-date-pickers/internals/components/PickersArrowSwitcher';
import MuiXDatePickersInternalsHooksUseutils, { useLocaleText, useUtils } from '@mui/x-date-pickers/internals/hooks/useUtils';
import MuiXDatePickersInternalsHooksUseviews, { useViews } from '@mui/x-date-pickers/internals/hooks/useViews';
import MuiXDatePickersInternalsUtilsDateUtils, { findClosestEnabledDate } from '@mui/x-date-pickers/internals/utils/date-utils';
import * as  MuiXDatePickersLocalizationprovider from '@mui/x-date-pickers/LocalizationProvider';
import MuiXDatePickersMobiledatepicker, { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import MuiXDatePickersPickersday, { PickersDay } from '@mui/x-date-pickers/PickersDay';
import PropTypes, { array, bool, element, func, number, object, oneOf, string } from 'prop-types';
import React, { type CSSProperties, type ChangeEvent, Children, type Component, type Dispatch, type HTMLAttributes, type MouseEvent, type ReactElement, type ReactNode, type SetStateAction, StrictMode, cloneElement, createContext, createRef, forwardRef, isValidElement, memo, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactBeautifulDnd, { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ReactCustomScrollbars, { Scrollbars } from 'react-custom-scrollbars';
import ReactDom, { unstable_batchedUpdates } from 'react-dom';
import ReactIntl, { FormattedMessage, IntlProvider, type MessageFormatElement, useIntl } from 'react-intl';
import ReactRedux, { type DefaultRootState, Provider, connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReactReduxLibUtilsReactbatchedupdates, { unstable_batchedUpdates } from 'react-redux/lib/utils/reactBatchedUpdates';
import ReactRouter, { useNavigate } from 'react-router';
import ReactRouterDom, { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation, useMatch, useNavigate, useParams, useResolvedPath, useSearchParams } from 'react-router-dom';
import ReactTransitionGroup, { CSSTransition, Transition, TransitionGroup } from 'react-transition-group';
import Redux, { type Dispatch, applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxDevtoolsExtension, { composeWithDevTools } from 'redux-devtools-extension';
import Reselect, { createSelector } from 'reselect';