import { formatServiceRow } from "../pages/api/getServices"
import { loadDoc } from "../utils/spreadsheets"

export default async function getServiceByIndex(serviceIndex: string) {
  const spreadsheetsDoc = await loadDoc()
  const servicesSheet = spreadsheetsDoc.sheetsByIndex[0]

  const serviceRow = await servicesSheet.getRows({offset: Number(serviceIndex), limit: 1})

  if(!serviceRow[0]) throw new Error(`Service with index ${serviceIndex} not found`)

  return formatServiceRow(serviceRow[0])
}