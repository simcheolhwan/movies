import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

export const api = functions.https.onRequest(async (request, response) => {
  const start = Date.now()
  const snapshot = await admin
    .database()
    .ref('/')
    .once('value')
  const end = Date.now()

  const result = {
    duration: end - start,
    type: typeof snapshot
  }

  response.send(result)
})
