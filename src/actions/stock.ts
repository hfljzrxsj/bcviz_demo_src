import axios from "axios";
/**  
 * 库存信息接口  
 */
interface Stock {
  /**  
   * 库存ID（主键，自增）  
   */
  id: number;

  /**  
   * 商品ID（外键，关联product表的id）  
   */
  prodId: number;

  /**  
   * 销售库存  
   */
  salesStock: number | null;

  /**  
   * 真实库存  
   */
  realStock: number | null;
}
export const deductionStock = (data: {
  readonly productId: Stock['prodId'];
  readonly count: number;
}) => axios.post<ReadonlyArray<Stock>>('/deductionStock', data).then(e => e.data).catch(console.error);
/**
 * 根据商品id查询商品库存
 */
export const findStockByProductId = (productId: Stock['prodId']) => axios.get<Stock>(`/findStockByProductId/${productId}`).then(e => e.data).catch(console.error);