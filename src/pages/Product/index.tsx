import { queryAllProduct, type Product } from "@/actions/product";
import MyTable from "@/components/MyTable";
import { StrictMode } from "react";

export const product_name = 'product_name';
export const product_name_text = '商品价格';
export default function Product () {
  return <StrictMode><MyTable<Omit<Product, 'id'>>
    columns={[{
      label: product_name,
      text: '商品名称'
    },
    {
      label: 'price', text: product_name_text,
      // format: (value: number) => {
      //   if (value === 5000) {
      //     return `5000元以上`;
      //   }
      //   return `${value.toLocaleString()}元`;
      // },
    },
    ]}
    action={queryAllProduct}
  // totalSum
  /></StrictMode>;
}