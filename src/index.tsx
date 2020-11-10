import React from "react"
import { render } from "react-dom"
import * as serviceWorker from "./serviceWorker"
import "./index.scss"
import App from "./components/App"

render(<App />, document.getElementById("movies"))
serviceWorker.register()
