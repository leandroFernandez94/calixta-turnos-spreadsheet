import { GoogleSpreadsheetWorksheet } from "google-spreadsheet"
import getServiceByIndex from "../../helpers/getServiceByIndex"
import { loadDoc } from "../../utils/spreadsheets"
import { FormattedService } from "./getServices"

const MIN_SERVICE_DURATION = 16
const NULL_RESERVATION_STRING = '--------'

interface FormattedSpot {
  time: string,
  reservedBy: string | null
}

function getInitialBookedSpot(spots:FormattedSpot[], neededSpots: number): number | undefined {
  let initialSpot = 0
  let accumulated = 0
  for(let i = 0; i < spots.length; i++) {
    const currentSpot = spots[i]

    //already reserved, reset accumulator and try with next spot
    if(currentSpot.reservedBy) {
      accumulated = 0
      initialSpot++
      continue
    } else {
      accumulated++
      if(accumulated === neededSpots) {
        return initialSpot
      }
    }
  }
}

function getNeededSpots(duration: number) {
  return Math.ceil(duration / MIN_SERVICE_DURATION)
}

async function getDaySpots(daySheet: GoogleSpreadsheetWorksheet): Promise<FormattedSpot[]> {
  const rows = await daySheet.getRows()

  return rows.map(row => ({
    time: row.horario,
    reservedBy: row.reserva === NULL_RESERVATION_STRING ? null : row.reserva
  }))
}

function getServicesTotalDuration(services: FormattedService[]) {
  return services.reduce((acum, curr) => acum + curr.duration, 0)
}

async function reserveSpots(daySheet: GoogleSpreadsheetWorksheet, name: string, initialBookedSpot: number, neededSpots: number) {
  const rows = await daySheet.getRows({offset: initialBookedSpot, limit: neededSpots})
  rows.forEach(async row => {
    row.reserva = name
    await row.save();
  })
}

export default async function bookServices(clientName: string, serviceDay: string, servicesIndex: string[]) {
  const spreadsheetsDoc = await loadDoc()

  const sheet = spreadsheetsDoc.sheetsByTitle[serviceDay]

  const spots = await getDaySpots(sheet)

  const services = await Promise.all(servicesIndex.map(getServiceByIndex))

  const totalDuration = getServicesTotalDuration(services)

  const neededSpots = getNeededSpots(totalDuration)

  const initialBookedSpot =  getInitialBookedSpot(spots, neededSpots)

  if(initialBookedSpot === undefined) {
    throw new Error("No hay lugar para hacer el/los servicios en esta fecha :(")
  }

  await reserveSpots(sheet, clientName, initialBookedSpot, neededSpots)

  return {}
} 