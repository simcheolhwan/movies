import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

const config =
  process.env.REACT_APP_ENV === "development"
    ? {
        apiKey: "AIzaSyDm_5wa9CrNMtEwdhFxAGhv8RlKBdDfGqg",
        authDomain: "movies-development.firebaseapp.com",
        databaseURL: "https://movies-development.firebaseio.com",
        projectId: "movies-development",
      }
    : {
        apiKey: "AIzaSyA6TAYpwm5ujBZw6_kpKorDp1e8QVExzZY",
        authDomain: "movies-production.firebaseapp.com",
        databaseURL: "https://movies-production.firebaseio.com",
        projectId: "movies-production",
      }

const app = initializeApp(config)
export const auth = getAuth(app)
export const db = getDatabase(app)
