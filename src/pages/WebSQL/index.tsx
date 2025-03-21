import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Checkbox, Dialog, Fab, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Skeleton, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, type AlertColor, type DialogProps, type FormControlProps, type SelectProps } from "@mui/material";
import type { WindowDatabase, SQLResultSet, DOMString, SQLResultSetRowList } from "./type";
import { useGetState, useRequest, useSafeState, useSetState, useThrottleFn, useUpdateEffect } from "ahooks";
import { useCallback, useEffect, useMemo, type Dispatch } from "react";
import style from './_index.module.scss';
import * as classNames from "classnames";
import { unstable_batchedUpdates } from "react-dom";
import { waitLastEventLoop } from "@/utils/waitLastEventLoop";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from "react-router";
import { type snackbarAlertAction, enumActionName, enumSnackbarAlert, enumSeverity, useSnackBarTypedSelector } from "@/store/SnackBarRuducer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { commonUseRequestParams } from "@/utils/const";
import { enumDB, useDBTypedSelector } from "@/store/DBReducer";
const { entries, values, keys } = Object;
interface Student {
  student_id: number;
  student_name: string;
  sex: number; // 假设sex可以为null，如果它不是必需的，或者数据库允许NULL值  
  age: number; // 假设age可以为null，如果它不是必需的，或者数据库允许NULL值  
  college_id: number; // 假设college_id可以为null，如果它不是必需的，或者数据库允许NULL值  
  class_id: number; // 假设class_id可以为null，如果它不是必需的，或者数据库允许NULL值  
  birthdate: Date; // 使用Date类型来表示日期，允许为null  
  registration_date: Date; // 使用Date类型来表示日期，由于它在SQL中是非空的，这里也应该是非空的  
  address: string; // 假设address可以为null，如果它不是必需的，或者数据库允许NULL值  
}
//@ts-expect-error
const that: WindowDatabase = window ?? global ?? globalThis ?? self ?? this;
const name = import.meta.env.VITE_DBName;
const version = '1.0';
const displayName = name;
const estimatedSize = 2 * 1024 * 1024;
export const db = that.openDatabase(name, version, displayName, estimatedSize, (e) => {
  console.log('sucess', e, 'version', e.version);
});
const allString = '未选择';
type unionProps = SelectProps & FormControlProps;
interface SelectFromDB extends unionProps {
  readonly i: idToNameOne;
}
const SelectFromDB = (props: SelectFromDB) => {
  const { i, ...others } = props;
  const { foreignTable, foreignKey, id } = i;
  const [data, setData] = useSafeState<SQLResultSetRowList>();
  useEffect(() => {
    if (foreignTable && foreignKey)
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${foreignTable}`, [], function (_tx, results) {
          setData(results.rows);
        });
      }, (e) => {
        console.log(e);
      }, () => {
        console.log('success');
      });
  }, [foreignTable, foreignKey]);
  return <FormControl fullWidth {...others}>
    <InputLabel title={i.id}>{i.name}</InputLabel><Select
      fullWidth
      {...others}
    >
      <MenuItem value={undefined}>{allString}</MenuItem>
      {i.enum ? (i.enum?.map((i, index) => <MenuItem value={index} key={index}>{i}</MenuItem>)) : (new Array(data?.length).fill(' ').map((_i, index) => <MenuItem value={data?.item(index)[id ?? '']} key={index}>{data?.item(index)[foreignKey ?? '']}</MenuItem>))
      }
    </Select></FormControl>;
};
type keyOfStudent = keyof Student;
type RecordIdBool = Record<keyOfStudent, boolean>;
type RecordOneRow = Record<keyOfStudent, number | string>;
const minDistance = 0;
interface idToNameOne {
  readonly id: keyOfStudent;
  readonly name: string;
  readonly type?: 'enum' | 'number' | 'between';
  readonly enum?: ReadonlyArray<string>;
  readonly foreignTable?: string;
  readonly foreignKey?: string;
  readonly primary?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}
const isVavid = (i: unknown) => i !== null && i !== undefined && i !== '';
const isTypeNumber = (i: idToNameOne | undefined) => Boolean(i?.type);
const isTypeNumberToString = (i: Parameters<typeof isTypeNumber>[0], v: string | number | Date) => isTypeNumber(i) ? v : `'${v}'`;
interface AlertProps {
  readonly severity: AlertColor,
  readonly alertText: string | DOMString;
}
export default function WebSQL () {
  const dispatch = useDispatch<Dispatch<snackbarAlertAction>>();
  const { subtitle, id } = useParams();
  const { index, config } = useDBTypedSelector(state => ({
    index: state.DB[enumDB.index],
    config: state.DB[enumDB.config]
  }));
  const { data, loading, refresh } = useRequest(() => axios.get<ReadonlyArray<idToNameOne>>(`${import.meta.env.VITE_sqlFolder}/${id}.json`).then(e => e.data).catch(console.error), commonUseRequestParams);
  useUpdateEffect(() => { refresh(); }, [id]);
  const tableName = id ?? '';
  // const tableName = 'Students';
  const [page, setPage, getPage] = useGetState(0);
  const [rowsPerPage, setRowsPerPage, getRowsPerPage] = useGetState(10);
  const [count, setCount, getCount] = useGetState(0);
  const idToName: ReadonlyArray<idToNameOne> = Array.isArray(data) ? (data ?? []) : [];
  const idToNamePrimary = idToName.filter(i => i.primary);
  const idToNameRecord = idToName.reduce((pre, cur) => {
    const foreignKey = cur.foreignKey;
    if (foreignKey) {
      pre[foreignKey] = cur;
    }
    pre[cur.id] = cur;
    return pre;
  }, {} as Record<string, idToNameOne>);
  const idToNameKeys = idToName.map(i => i.id);
  const foreignKeysArr = idToName.filter(i => Boolean(i.foreignKey)).map(i => String(i.foreignKey));
  const idToNameShow = idToName.filter(i => !Boolean(i.foreignKey)).map(i => String(i.id));
  const columnsShow = [...idToNameShow, ...foreignKeysArr];
  const [sql, setSql, getSql] = useGetState('');
  const [makeSQL, setMakeSQL] = useSetState<Partial<Student>>({
  });
  const makeSQLArr = entries(makeSQL).filter(([k, v]) => isVavid(v) && idToNameKeys.includes(k as keyOfStudent));
  const makeSQLInitCreate = useCallback((bool: boolean) => idToName.reduce((pre, cur) => {
    pre[cur.id] = cur.type ? false : bool;
    return pre;
  }, {} as RecordIdBool), [idToName]);
  const makeSQLInit = makeSQLInitCreate(false);
  const [makeSQLRequire, setMakeSQLRequire] = useSetState<RecordIdBool>(makeSQLInit);
  const makeSQLRequireArr = values(makeSQLRequire);
  const [makeSQLFuzzy, setMakeSQLFuzzy] = useSetState<RecordIdBool>(makeSQLInit);
  //--------------------SQL--------------------
  const IndexedBy = (index && subtitle === config?.[0]?.path) ? ` INDEXED BY ${tableName}_Index` : '';
  const leftJoin = idToName.filter(i => i.foreignTable).reduce((pre, cur) => {
    const { foreignTable, id } = cur;
    return pre + `LEFT OUTER JOIN ${foreignTable} USING (${id}) `;
    // return pre + `LEFT OUTER JOIN ${foreignTable} ON ${tableName}.${id}=${foreignTable}.${id} `;
    // return pre + `NATURAL JOIN ${foreignTable} `;
    // NATURAL JOIN / LEFT OUTER JOIN
  }, ' ').trimEnd();
  const LimitOFFET = ` LIMIT ${getRowsPerPage()} OFFSET ${getRowsPerPage() * getPage()}`;
  const initSQL = `SELECT * FROM ${tableName}${IndexedBy}${leftJoin}${LimitOFFET};`;
  const noHasWhere = !makeSQLArr.length;
  const WHERE_SQL = noHasWhere ? '' : ' WHERE ' +
    makeSQLArr.reduce((pre, cur) => {
      const [k, v] = cur;
      if (!isVavid(v)) return pre;
      if (Array.isArray(v)) return [...pre, `(${k} BETWEEN ${v[0]} AND ${v[1]})`];//(${k}>=${v[0]}) and (${k}<=${v[1]})
      else return [...pre, `${tableName}.${k} ${makeSQLFuzzy[k as keyOfStudent] ?
        `LIKE "%${String(v)}%"` :
        `= ${isTypeNumberToString(idToNameRecord[k], v)}`}`];
    }, [] as ReadonlyArray<string>).join(
      ' AND ').trimEnd();
  //--------------------SQL--------------------
  const { run: buttonOnClick } = useThrottleFn(useCallback((s = sql) => {
    const arr = s.trim().split(';');
    db.transaction(tx => {
      for (let i of arr) {
        if (i)
          tx.executeSql(i, [], function (_tx, results) {
            const { rows, rowsAffected } = results;
            console.log(results);
            if (rowsAffected === 0 && rows) {
              setSQLResultSetRowList({
                rows
              });
              setCount(rows.length);
            }
            else {
              dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `${i.split(' ')[0]}成功！`, [enumSnackbarAlert.severity]: enumSeverity.success } });
            }
          });
      }
    }, (e) => {
      console.log(e);
      setSeverity({
        severity: 'error',
        alertText: `执行失败, 原因：${e.message}`
      });
      dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `执行失败, 原因：${e.message}`, [enumSnackbarAlert.severity]: enumSeverity.error } });
    }, () => {
      console.log('success');
      db.transaction(tx => {
        //--------------------SQL--------------------
        tx.executeSql(`SELECT COUNT(*) FROM ${tableName}${WHERE_SQL};`, [], function (_tx, results) {
          //--------------------SQL--------------------
          const { rows } = results;
          setCount(rows.item(0)['COUNT(*)']);
        });
      }, (e) => {
        console.log(e);
      }, () => {
        console.log('success');
      });
    });
  }, [sql, tableName]));
  useEffect(() => unstable_batchedUpdates(() => {
    if (!data)
      return;
    setSql(initSQL);
    setMakeSQL(keys(makeSQL).reduce((pre, cur) => {
      pre[cur as keyOfStudent] = undefined as never;
      return pre;
    }, {} as Student));
    const realMakeSQLInit = {
      ...makeSQLInitCreate(false), ...[...keys(makeSQLRequire), ...keys(makeSQLFuzzy)].reduce((pre, cur) => {
        pre[cur as keyOfStudent] = false;
        return pre;
      }, {} as RecordIdBool)
    };
    setMakeSQLRequire(realMakeSQLInit);
    setMakeSQLFuzzy(realMakeSQLInit);
    waitLastEventLoop(() => buttonOnClick(initSQL));
  }), [data]);
  const [SQLResultSetRowList, setSQLResultSetRowList] = useSetState<
    SQLResultSet>({
      insertId: 0,
      rowsAffected: 0,
      rows: {
        length: 0,
        item: () => { },
      }
    });
  useUpdateEffect(() => {
    const SELECT_something = makeSQLRequireArr.every(i => !Boolean(i)) ?
      //--------------------SQL--------------------
      '*' :
      entries(makeSQLRequire).reduce((pre, cur) => {
        const [k, v] = cur;
        const i = idToNameRecord[k];
        if (v) return [...pre, `${i?.foreignTable ?? tableName}.${i?.foreignKey ?? k}`];
        else return pre;
      }, [] as ReadonlyArray<string>).join(', ');
    setSql(`SELECT ${SELECT_something} FROM ${tableName}${IndexedBy}${leftJoin}${WHERE_SQL}${LimitOFFET};`);
    //--------------------SQL--------------------
  }, [makeSQL, makeSQLFuzzy, makeSQLRequire, page, rowsPerPage, index]);
  useUpdateEffect(() => {
    waitLastEventLoop(() => buttonOnClick(getSql()));
  }, [page, rowsPerPage]);
  const rows = SQLResultSetRowList?.rows;
  const columns = useMemo(() => {
    if (rows.length)
      return Object.keys(rows.item(0) ?? {}).filter(i => columnsShow.includes(i));
    return [];
  }, [rows]) as ReadonlyArray<keyOfStudent>;
  const [severity, setSeverity] = useSetState<AlertProps>({
    severity: 'info',
    alertText: '待操作'
  });
  const { open } = useSnackBarTypedSelector(state => ({
    open: state.SnackBar.open,
  }));
  useUpdateEffect(() => unstable_batchedUpdates(() => {
    waitLastEventLoop(() => {
      const obj: AlertProps = {
        severity: 'success',
        alertText: `执行成功, 查到 ${getCount() ?? rows?.length} 条记录`
      };
      setSeverity(obj);
      if (!open)
        dispatch({ type: enumActionName.OPENTRUE, payload: obj });
    });
  }), [rows]);
  const [CRUDDialogOpen, setCRUDDialogOpen] = useSetState<{
    readonly open: boolean;
    readonly type: CRUDDialogProps['type'];
    readonly dialogData: RecordOneRow;
  }>({
    open: false,
    type: 'UD',
    dialogData: rows.length ? rows.item(0) : {}
  });
  const { dialogData } = CRUDDialogOpen;
  const WHERE_something = (dialogData: RecordOneRow) => idToNamePrimary.map(cur => {
    const { id } = cur;
    const v = dialogData[id];
    return `${id}=${isTypeNumberToString(cur, v)}`;
  }).join(' AND ');
  if (loading || idToName.length === 0) {
    return <Skeleton
      className={style['Skeleton'] ?? ''}
      variant="rounded"
      animation="wave" />;
  }
  return <>
    <Paper elevation={24} className={style['Paper'] ?? ''}>
      <Accordion
        // defaultExpanded
        elevation={24}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>筛选器</Typography>
        </AccordionSummary>
        <AccordionDetails className={style['Input'] ?? ''}>
          {idToName.map((i, index) => {
            const { id } = i;
            return <Paper elevation={24} key={index}
              className={classNames({ [style['last'] ?? '']: i.type === 'between' }) ?? ''}
              title={id}
            >
              <Checkbox
                title={id}
                onChange={(_e, c) => {
                  setMakeSQLRequire({
                    [id]: c
                  } as RecordIdBool);
                }}
                checked={makeSQLRequire[id]}
              />{(() => {
                switch (i.type) {
                  case 'enum': {
                    return <SelectFromDB
                      fullWidth
                      label={i.name}
                      title={id}
                      onChange={(e) => {
                        const { target } = e;
                        if ('value' in target) {
                          const value = target['value'];
                          setMakeSQL({
                            [id]: value
                          });
                        }
                      }}
                      i={i}
                    />;
                  }
                  case 'between': {
                    const arr = makeSQL[id];
                    return <>
                      <span title={id}>{i.name}</span>
                      <Slider
                        title={id}
                        min={i.min ?? 0}
                        max={i.max ?? 100}
                        step={i.step ?? 1}
                        value={Array.isArray(arr) ? arr : [0, 100]}
                        onChange={(_event,
                          newValue,
                          activeThumb,) => {
                          if (!Array.isArray(newValue)) {
                            return;
                          }
                          const [v1, v2] = newValue;
                          const { id } = i;
                          if (v1 !== undefined && v2 !== undefined)
                            if (v2 - v1 < minDistance) {
                              if (activeThumb === 0) {
                                const clamped = Math.min(v1, 100 - minDistance);
                                setMakeSQL({ [id]: [clamped, clamped + minDistance] });
                              } else {
                                const clamped = Math.max(v2, minDistance);
                                setMakeSQL({ [id]: [clamped - minDistance, clamped] });
                              }
                            } else {
                              setMakeSQL({ [id]: newValue });
                            }
                        }}
                        valueLabelDisplay="on"
                        disableSwap
                      /></>;
                  }
                  default:
                    return <>
                      <TextField
                        // autoFocus
                        aria-autocomplete="both"
                        label={i.name}
                        title={id}
                        type={i.type === 'number' ? 'number' : "search"}
                        onChange={(e) => {
                          setMakeSQL({
                            [id]: e.target.value
                          });
                        }}
                      />
                      <FormControlLabel
                        title={id}
                        control={<Checkbox title={id} />}
                        label="模糊搜索"
                        onChange={(_e, c) => setMakeSQLFuzzy({
                          [id]: c
                        } as RecordIdBool)}
                        checked={makeSQLFuzzy[id]}
                      /></>;
                }
              })()}
            </Paper>;
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={24} className={style['sqlInput'] ?? ''}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>SQL执行</Typography>
        </AccordionSummary>
        <AccordionDetails className={style['AccordionDetails'] ?? ''}>
          <TextField
            multiline
            autoFocus
            fullWidth
            aria-autocomplete="both"
            label='SQL'
            onChange={e => setSql(e.target.value)}
            value={sql}
          />
          <Button size='large' variant='contained'
            onClick={_e => {
              setPage(pre => {
                if (!pre)
                  buttonOnClick(getSql());
                return 0;
              });

            }}
          >Transaction</Button>
        </AccordionDetails>
      </Accordion>
      <Paper elevation={24} className={style['fullWidth'] ?? ''}><Alert severity={severity.severity} variant="filled">{severity.alertText}</Alert></Paper>
      {/* <Paper elevation={24}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>最后插入行</TableCell>
              <TableCell>{SQLResultSetRowList?.insertId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>影响行数</TableCell>
              <TableCell>{SQLResultSetRowList?.rowsAffected}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper> */}
      <Paper elevation={24}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align='center'
                    title={column}
                  >
                    {idToNameRecord[column]?.name ?? column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                new Array(rows.length).fill(' ').map((_i, index) =>
                  <TableRow hover key={index}>
                    {
                      (columns.map((column, ind) => {
                        const cur = idToNameRecord[column];
                        const realDataKey = cur?.id;
                        const dialogData: RecordOneRow = rows?.item(index);
                        const hasEnum = cur?.enum;
                        const value = dialogData[column];
                        return (
                          <TableCell
                            {...(realDataKey && { title: String(dialogData[realDataKey]) })}
                            key={ind}
                            align='center'
                            {...(idToNameRecord[column]?.primary && {
                              onClick: () => {
                                setCRUDDialogOpen({
                                  open: true,
                                  type: 'UD',
                                  dialogData
                                });
                              },
                              className: style['aLink'] ?? ''
                            })}
                          >
                            {(hasEnum && isVavid(value)) ? hasEnum[Number(value)] : (typeof value === 'number' ? Math.round(value * 1000) / 1000 : value)}
                          </TableCell>
                        );
                      }))}
                  </TableRow>)
              }
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={columnsShow.length} className={style['TableFooter'] ?? ''}></TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count ?? rows?.length ?? 10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(event) => unstable_batchedUpdates(() => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          })}
          labelDisplayedRows={(paginationInfo) => `${paginationInfo.from}-${isNaN(paginationInfo.to) ? 1 : paginationInfo.to}/共${paginationInfo.count ?? 0}项`}
          labelRowsPerPage='每页行数：'
        />
      </Paper>
      <Paper elevation={24}>
        <Fab color="primary" size='large' onClick={() => unstable_batchedUpdates(() => {
          setCRUDDialogOpen({
            open: true,
            type: 'C',
            dialogData: idToName.reduce((pre, cur) => {
              pre[cur.id] = '';
              return pre;
            }, {} as RecordOneRow)
          });
        })}>
          <AddIcon />
        </Fab></Paper>
    </Paper>
    <CRUDDialog
      onClose={() => setCRUDDialogOpen({ open: false })}
      className={style['dialog'] ?? ''}
      {...CRUDDialogOpen}
      dialogDataProps={dialogData}
      {...{
        idToNameRecord,
        idToNameKeys,
        idToNamePrimary,
        idToName,
        comfirm: (code) => unstable_batchedUpdates(() => {
          setSql(code);
          buttonOnClick(`${code};${initSQL}`);
          setCRUDDialogOpen({ open: false });
        }),
        //--------------------SQL--------------------
        modifySQL: ((dialogData) => {
          const SET_something = entries(dialogData).filter(([k]) => idToNameKeys.includes(k as keyOfStudent) && !idToNameRecord[k]?.primary).map(([k, v]) => `${k}=${(!isVavid(v)) ? 'null' : (isTypeNumberToString(idToNameRecord[k], v))}`
          ).join(', ');
          return `UPDATE ${tableName} SET ${SET_something} WHERE ${WHERE_something(dialogData)};`;
        }),
        deleteSQL: ((dialogData) => {
          return `DELETE FROM ${tableName} WHERE ${WHERE_something(dialogData)};`;
        }),
        insertSQL: ((dialogData) => {
          const hasValue = entries(dialogData).filter(([k, v]) => isVavid(v) && idToNameKeys.includes(k as keyOfStudent));
          const keyOfIdToNamePrimary = idToNamePrimary.map(i => i.id);
          const keyOfHasValue = hasValue.map(([k]) => k);
          if (keyOfIdToNamePrimary.some(i => !keyOfHasValue.includes(i))) {
            dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: `还有必填项未填写`, [enumSnackbarAlert.severity]: enumSeverity.warning } });
            return '';
          }
          const INSERT_where = hasValue.map(([k]) => k).join(', ');
          const INSERT_value = hasValue.map(([k, v]) => `${isTypeNumberToString(idToNameRecord[k], v)}`).join(', ');
          return `INSERT INTO ${tableName} (${INSERT_where}) VALUES (${INSERT_value});`;
        }),
        //--------------------SQL--------------------
      }}
    />
  </>;
}
interface CRUDDialogProps extends DialogProps {
  readonly type: 'C' | 'UD';
  readonly dialogDataProps: RecordOneRow;
  readonly idToNameRecord: Record<keyOfStudent, idToNameOne>;
  readonly idToNameKeys: ReadonlyArray<keyOfStudent>;
  readonly comfirm: (e: string) => void;
  readonly modifySQL: (dialogData: RecordOneRow) => string;
  readonly deleteSQL: (dialogData: RecordOneRow) => string;
  readonly idToName: ReadonlyArray<idToNameOne>;
  readonly idToNamePrimary: ReadonlyArray<idToNameOne>;
  readonly insertSQL: (dialogData: RecordOneRow) => string;
}
const CRUDDialog = (props: CRUDDialogProps) => {
  const { type: typeProps, dialogDataProps, idToNameRecord, idToNameKeys, modifySQL, deleteSQL, comfirm, idToNamePrimary, insertSQL, idToName, ...others } = props;
  const [dialogData, setDialogData] = useSetState<RecordOneRow>(dialogDataProps);
  const [confirmDialog, setComfirmDialog] = useSetState({
    open: false,
    text: '',
    code: '',
  }); const isUD = typeProps === 'UD';

  useEffect(() => {
    setDialogData(dialogDataProps);
  }, [dialogDataProps, open]);
  const setComfirmDialogClose = () => {
    setComfirmDialog({
      open: false,
    });
  };
  const textFieldProps = (v: string | number, primary: boolean | undefined) => (isUD ? { defaultValue: v, disabled: Boolean(primary) } : { required: Boolean(primary) });
  return <>
    <Dialog
      {...others}
    >
      {entries(dialogData ?? {}).filter(([k]) => idToNameKeys.includes(k as keyOfStudent)).map(([k, v], index) => {
        const i = idToNameRecord[k as keyOfStudent];
        const type = i?.type;
        const isNumber = isTypeNumber(i);
        const primary = i.primary;
        if (i && type === 'enum')
          return <SelectFromDB
            key={index}
            i={i}
            {...textFieldProps(v, primary)}
            label={i.name}
            title={k}
            onChange={(e) => {
              const { target } = e;
              if ('value' in target) {
                const value = target['value'];
                setDialogData({
                  [k]: value
                } as RecordOneRow);
              }
            }}
          />;
        return <TextField
          aria-autocomplete="both"
          label={i.name}
          title={k}
          type={isNumber ? 'number' : "search"}
          {...textFieldProps(v, primary)}
          key={index}
          onChange={(e) => {
            const { value } = e.target;
            // if (value !== null)
            setDialogData({
              [k]: value
            } as RecordOneRow);
          }}
        />;
      })}
      {isUD ? <><Button size="large" variant="contained" onClick={() => {
        setComfirmDialog({
          open: true,
          text: '确认修改？',
          code: modifySQL(dialogData)
        });
      }}>修改</Button>
        <Button size="large" variant="outlined" color="error" onClick={() => {
          setComfirmDialog({
            open: true,
            text: '确认删除？',
            code: deleteSQL(dialogData)
          });
        }}>删除</Button></> : <Button size="large" variant="contained" onClick={() => {
          const sql = insertSQL(dialogData);
          if (sql)
            setComfirmDialog({
              open: true,
              text: '确认新增？',
              code: sql,
            });
        }}>新增</Button>}
    </Dialog>
    <Dialog open={confirmDialog.open} onClose={setComfirmDialogClose} className={style['dialog'] ?? ''}>
      <h1>{confirmDialog.text}</h1>
      <TextField
        defaultValue={confirmDialog.code}
        onChange={e => setComfirmDialog({
          code: e.target.value
        })}
        autoFocus
        aria-autocomplete="both"
        label='sql'
        type="search"
        multiline
        fullWidth
      />
      <Button size="large" variant="outlined" color="warning" onClick={() => {
        comfirm(confirmDialog.code);
        setComfirmDialogClose();
      }}>确认</Button>
      <Button size="large" variant="contained" onClick={setComfirmDialogClose}>取消</Button>
    </Dialog>
  </>;
};