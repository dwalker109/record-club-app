import React, { FC } from "react";
import Login, { SpotifyCallback } from "./auth/Login";
import { Route, Switch } from "wouter";

const App: FC = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/oauth/spotify-cb" component={SpotifyCallback} />
  </Switch>
);

export default App;
