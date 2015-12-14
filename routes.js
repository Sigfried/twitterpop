import React from 'react';
import { Route } from 'react-router';
import DQData from './components/DQData';
import App from './containers/App';
import Main from './components/Main';
//import UserPage from './containers/UserPage';
//import RepoPage from './containers/RepoPage';

export default (
  <Route path="/" component={App}>
    <Route path="/main"
           component={Main} />
  </Route>
);
/*
    <Route path="/seedims"
           component={SeeDims} />
    <Route path="/dqdata"
           component={DQData} />
export default (
  <Route path="/" component={DQData}>
    <Route path="/:login/:name"
           component={RepoPage} />
    <Route path="/:login"
           component={UserPage} />
  </Route>
);
*/
