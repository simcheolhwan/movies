import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MediaList from './components/MediaList'
import Collect from './query/Collect'
import Directors from './query/Directors'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'

export default (
  <Switch>
    <Route path="/signin" component={SignIn} />
    <Route path="/signout" component={SignOut} />
    <Route path="/collect" component={Collect} />
    <Route path="/directors" component={Directors} />
    <Route path="/:genre" component={MediaList} />
    <Route path="/" component={MediaList} />
  </Switch>
)
