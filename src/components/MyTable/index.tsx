import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, CssBaseline, Dialog, TextField, Button } from "@mui/material";
import { StyledEngineProvider } from "@mui/system";
import { useRef, useState } from "react";
import { StrictMode } from "react";
import classes from './_index.module.scss';
import * as classnames from 'classnames';
import { useMap, useRequest, useUpdateEffect } from "ahooks";
import { unstable_batchedUpdates } from "react-dom";
import { commonUseRequestParams } from "@/utils/const";
import { product_name, product_name_text } from "@/pages/Product";
import type { Product } from "@/actions/product";
import { findStockByProductId } from "@/actions/stock";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
const { isSafeInteger } = Number;
export const regionName = 'regionName';
interface Type<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns: ReadonlyArray<{
    readonly label: keyof T;
    readonly format?: (value: number) => string;
    readonly text: string;
  }>;
  readonly action: (e?: number) => Promise<ReadonlyArray<T> | void>;
  readonly totalSum?: boolean;
}
const initArr = new Array(10).fill('');
// interface ProductDrawer extends Omit<ModalProps, 'children'> {
//   readonly drawerData: Product;
// }//DrawerProps
{/* <Global /> */ }
const DataOrLoadingTableRow = (props: { readonly text?: string; readonly value?: string | number | null | undefined; readonly loading?: boolean; }) => {
  const { text, value, loading = false } = props;
  return <TableRow hover>
    <TableCell>{text}：</TableCell>
    <TableCell align="center">{(value && !loading) ? value : <Skeleton
      variant="rounded"
      animation="wave"
    />}</TableCell>
  </TableRow>;
};
export default function MyTable<T extends Record<string, unknown> = Record<string, unknown>> (props: Type<T>) {
  const { columns, action, totalSum = false, ...others } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: rows = initArr, loading } = useRequest(action, { ...commonUseRequestParams, debounceWait: 300, });
  const ref = useRef<HTMLTableSectionElement>(null);
  const noDataOrLoading = loading || !rows;
  const rowsSlice = Array.isArray(rows) ? (totalSum ? rows : rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : initArr;
  const [ProductDrawerOpen, setProductDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<Product>({
    id: 0,
    product_name: '',
    price: 0,
  });
  useUpdateEffect(() => {
    setProductDrawerOpen(true);
    stockRun(drawerData.id);
  }, [(drawerData)]);
  const { data: stockData, run: stockRun, loading: stockLoading } = useRequest(findStockByProductId, { ...commonUseRequestParams, manual: true });
  const [tabValue, setTabValue] = useState<'1' | '2'>('1');
  const [
    ,
    {
      set,
      get
    }
  ] = useMap<Product['id'], {
    readonly buyCount?: number;
    readonly stockCount?: number;
  }>([]);
  const buyCount = get(drawerData.id)?.buyCount;
  return (<StrictMode>
    <StyledEngineProvider injectFirst>
      <Paper
        className={classnames(classes["root"])}
        elevation={24}
        {...others}
      >
        {/* <FilterDialogWithBreadcrumbs
          ref={childRef}
          //@ts-expect-error
          run={run}
          {...{ noNeedTime, noNeedAddress, timeNeedDay }}
        /> */}
        {/* <SearchInput run={run} /> */}
        <TableContainer
        >
          <Table stickyHeader>
            <TableHead
              ref={ref}
            >
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align='center'
                  >
                    {column.text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsSlice.map((row, index) =>
                <TableRow hover key={index}>
                  {(noDataOrLoading || typeof row === 'string') ?
                    <td
                      colSpan={columns.length}
                      className={classes['Skeleton'] ?? ''}
                      //@ts-expect-error
                      style={{ '--height': `${ref.current?.clientHeight}px` }}
                    ><Skeleton
                        variant="rounded"
                        animation="wave"
                      /></td> :
                    (columns.map((column, ind) => {
                      const label = column?.label;
                      const value = row?.[label];
                      return (
                        <TableCell
                          key={ind}
                          align='center'
                          {...(product_name === label && ind === 0 && {
                            onClick: setDrawerData.bind(null, row),
                            className: classes['aLink'] ?? ''
                          })}
                        >
                          {column.format && typeof value === 'number' ? column.format(value) : String(value)}
                        </TableCell>
                      );
                    }))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!totalSum && <TablePagination
          // rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows?.length ?? 10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(event) => unstable_batchedUpdates(() => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          })}
          // getItemAriaLabel={(type) => type}
          labelDisplayedRows={(paginationInfo) => `${paginationInfo.from}-${isNaN(paginationInfo.to) ? 1 : paginationInfo.to}/共${paginationInfo.count ?? 0}项`}
          labelRowsPerPage='每页行数：'
        />}
      </Paper>
      <CssBaseline />
      {/* <Modal */}
      <Dialog
        // anchor="bottom"
        // onClose={toggleDrawer(false)}
        // onOpen={toggleDrawer(true)}
        // disableSwipeToOpen={false}
        // ModalProps={{
        //   keepMounted: true,
        // }}
        open={ProductDrawerOpen}
        onClose={setProductDrawerOpen.bind(null, false)}
        className={classes['Dialog'] ?? ''}
      >
        <h1>{drawerData.product_name}</h1>
        <Table>
          <TableBody>
            {/* <TableRow hover> */}
            <DataOrLoadingTableRow
              text={product_name_text}
              value={drawerData.price}
            />
            <DataOrLoadingTableRow
              text={'销售库存'}
              value={stockData?.salesStock}
              loading={stockLoading}
            />
            <DataOrLoadingTableRow
              text={'真实库存'}
              value={stockData?.realStock}
              loading={stockLoading}
            />
            {/* </TableRow> */}
          </TableBody>
        </Table>
        <TabContext value={tabValue} className={classes['TabList'] ?? ''}>
          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
          <TabList onChange={(_e, v) => { setTabValue(v); }} className={classes['TabList'] ?? ''}>
            <Tab label="下订单" value="1" />
            <Tab label="加库存" value="2" />
          </TabList>
          {/* </Box> */}
          {isSafeInteger(stockData?.realStock) && <TabPanel value="1">
            <TextField
              label="购买数量"
              type='number'
              onChange={e => {
                const { id } = drawerData;
                const { value } = e.target;
                const v_n = Number(value);
                const realStock = stockData?.realStock;
                if (isSafeInteger(v_n) && typeof realStock === 'number' && v_n <= realStock && v_n > 0)
                  set(id, {
                    ...get(id), buyCount: v_n
                  });
                else if (value === '')
                  set(id, {
                    ...get(id), buyCount: 0
                  });
              }}
              value={(isSafeInteger(buyCount) && Boolean(buyCount)) ? buyCount : ''}
              autoFocus
              autocomplete
              fullWidth
              // focused
              inputProps={{
                type: 'number',
                min: 1,
                max: stockData?.realStock
              }}
            // placeholder={`请输入大于0且小于等于${stockData?.realStock}的整数`}
            />
            <Button size='large' variant="contained" disabled={!Boolean(get(drawerData.id)?.buyCount)}>提交下单</Button>
          </TabPanel>}
          <TabPanel value="2">
            <TextField
              label="增加数量"
              type='number'
              value={get(drawerData.id)?.stockCount || ''}
              onChange={e => {
                const { id } = drawerData;
                const { value } = e.target;
                const v_n = Number(value);
                if (isSafeInteger(v_n) && v_n > 0)
                  set(id, {
                    ...get(id), stockCount: v_n
                  });
                else
                  set(id, {
                    ...get(id), stockCount: 0
                  });
              }}
              // placeholder='请输入大于等于0的正整数'
              fullWidth
              autoFocus
              autocomplete
              inputProps={{
                type: 'number',
                min: 1,
              }}
            />
            <Button size='large' variant="contained" disabled={!Boolean(get(drawerData.id)?.stockCount)}>提交修改</Button>
          </TabPanel>
        </TabContext>
      </Dialog>
    </StyledEngineProvider>
  </StrictMode>);
}
