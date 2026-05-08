import { getDB } from '@/lib/database'
import * as reportsRepository from '@/repository/reports-repository'
import { DateGroupingType } from '@/repository/reports-repository'

function getGroupingDates(grouping: DateGroupingType): { startDate: string, endDate: string } {
  const now = new Date()
  let startDate = new Date()

  switch (grouping) {
    case DateGroupingType.TODAY:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case DateGroupingType.THIS_WEEK: {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      startDate = new Date(now.getFullYear(), now.getMonth(), diff)
      break
    }
    case DateGroupingType.THIS_MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case DateGroupingType.THIS_YEAR:
      startDate = new Date(now.getFullYear(), 0, 1)
      break
  }

  startDate.setHours(0, 0, 0, 0)

  const startDateStr = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
  const endDateStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0]

  return {
    startDate: startDateStr,
    endDate: endDateStr,
  }
}

export async function getDashboardReport(grouping: DateGroupingType) {
  const db = getDB()
  const { startDate, endDate } = getGroupingDates(grouping)
  return await reportsRepository.getReportSales(db, startDate, endDate)
}

export async function getCustomRangeReport(startDate: string, endDate: string) {
  const db = getDB()
  const rows = await reportsRepository.getReportTopProductSales(db, startDate, endDate)

  const highProducts = rows
    .filter((r: any) => r.rank_type === 'highest')
    .map((r: any) => ({
      name: r.name,
      quantity: Number(r.quantity),
      revenue: Number(r.revenue),
      netProfit: Number(r.net_profit),
    }))

  const lowProducts = rows
    .filter((r: any) => r.rank_type === 'lowest')
    .map((r: any) => ({
      name: r.name,
      quantity: Number(r.quantity),
      revenue: Number(r.revenue),
      netProfit: Number(r.net_profit),
    }))

  return {
    highProducts,
    lowProducts,
  }
}
