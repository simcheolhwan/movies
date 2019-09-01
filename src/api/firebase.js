import { initializeApp, auth as authentication, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  development: {
    apiKey: 'AIzaSyDm_5wa9CrNMtEwdhFxAGhv8RlKBdDfGqg',
    authDomain: 'movies-development.firebaseapp.com',
    databaseURL: 'https://movies-development.firebaseio.com',
    projectId: 'movies-development'
  },
  production: {
    apiKey: 'AIzaSyA6TAYpwm5ujBZw6_kpKorDp1e8QVExzZY',
    authDomain: 'movies-production.firebaseapp.com',
    databaseURL: 'https://movies-production.firebaseio.com',
    projectId: 'movies-production'
  }
}[process.env.REACT_APP_ENV]

initializeApp(config)
export const db = database()
export const auth = authentication()
