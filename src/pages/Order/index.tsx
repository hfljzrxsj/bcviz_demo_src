import { queryAllOrder, type Order } from "@/actions/order";
import MyTable from "@/components/MyTable";
import { StrictMode } from "react";

export default function Order () {
  return <StrictMode><MyTable<Omit<Order, 'id'>>
    columns={[{
      label: 'order_number',
      text: '订单号'
    },
    {
      label: 'order_product_name', text: '订单商品名称',
      // format: (value: number) => {
      //   if (value === 5000) {
      //     return `5000元以上`;
      //   }
      //   return `${value.toLocaleString()}元`;
      // },
    },
    {
      label: 'order_price',
      text: '订单价'
    },
    {
      label: 'count', text: '商品数量'
      // , format: (value: number) => `${value.toLocaleString()}%`,
    },
    {
      label: 'buy_date',
      text: '购买时间'
    },
    ]}
    action={() => queryAllOrder().then(e => {
      if (!e)
        return [];
      return [...e, {
        order_number: null,
        order_product_name: '合计',
        order_price: e.reduce((pre, cur) => pre + (cur.order_price ?? 0), 0),
        count: e.reduce((pre, cur) => pre + (cur.count ?? 0), 0),
        buy_date: null,
      }];
    })}
    totalSum
  /></StrictMode>;
}