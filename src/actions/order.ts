import axios from "axios";
/**  
 * 订单表接口  
 */
export interface Order {
  /**  
   * 订单ID  
   */
  readonly id: number;

  /**  
   * 订单号  
   */
  readonly order_number: string | null;

  /**  
   * 订单商品名称  
   */
  readonly order_product_name: string | null;

  /**  
   * 订单价格  
   */
  readonly order_price: number | null;

  /**  
   * 商品数量  
   */
  readonly count: number | null;

  /**  
   * 购买时间  
   */
  readonly buy_date: Date | null;
}
/**
 * 查询所有订单
 */
export const queryAllOrder = () => axios.get<ReadonlyArray<Order>>('/queryAllOrder').then(e => e.data).catch(console.error);
/**
 * 下单方法
 */
export const submitOrder = (data: Pick<NonNullable<Order>, 'order_product_name' | 'order_price' | 'count'> & {
  readonly productId: Order['id'];
}) => axios.post<string>('/submitOrder', { ...data, }).then(e => e.data).catch(console.error);