import type { DBQueryable } from '@/lib/database'

export enum DateGroupingType {
  TODAY = 'TODAY',
  THIS_WEEK = 'THIS_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  THIS_YEAR = 'THIS_YEAR',
}

const queryReportSales = `
  SELECT
    COALESCE(SUM(total_revenue), 0) as revenue,
    COALESCE(SUM(total_net_profit), 0) as profit
  FROM orders
  WHERE
    created_at >= $1::date AND
    created_at < ($2::date + INTERVAL '1 day')
`

export async function getReportSales(
  db: DBQueryable,
  startDate: string,
  endDate: string,
) {
  const { rows } = await db.query(queryReportSales, [startDate, endDate])

  return {
    revenue: Number(rows[0].revenue),
    profit: Number(rows[0].profit),
  }
}

const queryReportTopProductSales = `
 WITH sales AS (
  SELECT
    product_name AS name,
    SUM(quantity) AS quantity,
    SUM(revenue) AS revenue,
    SUM(net_profit) AS net_profit
  FROM order_items
  JOIN orders o ON o.id = order_items.order_id
  WHERE
    o.created_at >= $1::date AND
    o.created_at < ($2::date + INTERVAL '1 day')
  GROUP BY product_name
)
SELECT * FROM (SELECT *, 'highest' AS rank_type FROM sales ORDER BY quantity DESC LIMIT 3) top
UNION ALL
SELECT * FROM (SELECT *, 'lowest' AS rank_type FROM sales ORDER BY quantity ASC LIMIT 3) bottom
`

export async function getReportTopProductSales(
  db: DBQueryable,
  startDate: string,
  endDate: string,
) {
  const { rows } = await db.query(queryReportTopProductSales, [startDate, endDate])

  return rows
}
