import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { loadDoc } from "../../utils/spreadsheets";

export interface FormattedService {
  id: string,
  service: string,
  duration: number
}

export function formatServiceRow(row: GoogleSpreadsheetRow): FormattedService {
  return {
    id: row.id,
    service: row.servicio,
    duration: Number(row.duracion)
  }
}

export default async function getServices() {
  const spreadsheetsDoc = await loadDoc()
  const servicesSheet = spreadsheetsDoc.sheetsByIndex[0]

  const rows = await servicesSheet.getRows()
  const formattedRows = rows.map(formatServiceRow)

  return formattedRows
}
