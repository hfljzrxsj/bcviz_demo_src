import { product_name } from "@/pages/Product";
import axios from "axios";
/**  
 * 商品信息接口  
 */
export interface Product {
  /**  
   * 商品ID（主键，自增）  
   */
  id: number;

  /**  
   * 商品名称  
   */
  [product_name]: string | null;

  /**  
   * 商品价格  
   */
  price: number | null;
}
/**
 * 查询所有商品
 */
export const queryAllProduct = () => axios.get<ReadonlyArray<Product>>('/queryAllProduct').then(e => e.data).catch(console.error);

/**
 * 根据商品id查询商品
 */
export const findByProductId = (productId: Product['id']) => axios.get<Product>(`/findByProductId/${productId}`).then(e => e.data).catch(console.error);