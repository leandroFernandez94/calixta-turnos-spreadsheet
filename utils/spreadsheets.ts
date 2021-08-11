import { GoogleSpreadsheet } from "google-spreadsheet";

export async function loadDoc() {
  const docId = process.env.GOOGLE_SHEETS_DOC_ID
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  
  if(!docId || !clientEmail || !privateKey) {
    throw new Error("please provide the expected env keys")
  }
  
  const doc = new GoogleSpreadsheet(docId)
  await doc.useServiceAccountAuth({
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  return doc
}