import './App.css';
import React, { useContext, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Login } from './components/user/Login';
import { ProtectedWorkspace } from './components/workspace/ProtectedWorkspace';
import { InitialRouter } from './components/routes/InitialRouter';
import { Workspace } from './components/workspace/Workspace'; 
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './themes/theme';

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={ theme }>
          <Router>
            <Switch>
              <InitialRouter exact path='/'>

              </InitialRouter>
              <Route path='/login'>
                <Login />
              </Route>
              <ProtectedWorkspace path='/workspace'>
                <Workspace />
              </ProtectedWorkspace>
            </Switch>
          </Router>
      </ThemeProvider>
      
    </div>
  );
}

export default App;
