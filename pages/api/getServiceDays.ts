import { loadDoc } from "../../utils/spreadsheets"

export default async function getServiceDays() {
  const spreadsheetsDoc = await loadDoc()
  
  const sheetCount = spreadsheetsDoc.sheetCount
  let serviceDays = []
  
  // services list and days template are skipped
  for(let i = 2; i < sheetCount; i++) {
    const day = spreadsheetsDoc.sheetsByIndex[i]
    serviceDays.push(day.title)
  }

  return serviceDays

}