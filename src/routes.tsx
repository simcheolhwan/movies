import { Route, Routes } from "react-router-dom"

import MediaList from "./components/MediaList"
import Menu from "./components/Menu"
import SignIn from "./components/SignIn"
import SignOut from "./components/SignOut"

import Collect from "./query/Collect"
import Query from "./query/Query"

export default (
  <Routes>
    <Route path="/menu" element={<Menu />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signout" element={<SignOut />} />
    <Route path="/collect" element={<Collect />} />
    <Route path="/query" element={<Query />} />
    <Route path="/:genre" element={<MediaList />} />
    <Route path="/" element={<MediaList />} />
  </Routes>
)
