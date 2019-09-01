import { initializeApp, auth as authentication, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  databaseURL: 'https://movies-development.firebaseio.com',
  projectId: 'movies-development'
}

initializeApp(config)
export const db = database()
export const auth = authentication()
